// Account + session handling for GCSEase.
//
// Two modes, chosen automatically:
//   • CLOUD (Supabase configured): real email/password auth with cross-device
//     accounts. Profile fields (name, board, tier) live in a `profiles` table.
//   • LOCAL (no Supabase): on-device accounts in localStorage, passwords salted
//     + SHA-256 hashed via the Web Crypto API. Good for local dev / offline.
//
// The rest of the app only uses these helpers, so swapping modes is invisible
// to the UI. `getCurrentUser()` is synchronous (returns a cached user); cloud
// session restore is async, so use `isAuthReady()` / `onAuthChange()` to know
// when the initial check has finished.

import { supabase, isCloud } from './supabase.js';

const USERS_KEY = 'gcsease:users:v1';
const SESSION_KEY = 'gcsease:session:v1';

let currentUser = null;
let ready = !isCloud; // local mode resolves synchronously below
const listeners = new Set();

function emit() { for (const l of listeners) l(currentUser); }
export function onAuthChange(l) { listeners.add(l); return () => listeners.delete(l); }
export function isAuthReady() { return ready; }
export function getCurrentUser() { return currentUser; }

const normEmail = (e) => String(e || '').trim().toLowerCase();

// ---------------------------------------------------------------- local mode
function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch { return {}; }
}
function writeUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch { /* private mode */ }
}
function publicUser(rec) {
  if (!rec) return null;
  const { passwordHash, salt, ...safe } = rec;
  return safe;
}
async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
function randomSalt() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return Array.from(a).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function localBootstrap() {
  try {
    const id = localStorage.getItem(SESSION_KEY);
    currentUser = id ? publicUser(readUsers()[id]) : null;
  } catch { currentUser = null; }
  ready = true;
}

// ---------------------------------------------------------------- cloud mode
async function userFromSession(session) {
  if (!session?.user) return null;
  let profile = null;
  try {
    const { data } = await supabase.from('profiles').select('name, board, tier').eq('id', session.user.id).maybeSingle();
    profile = data;
  } catch { /* profile may not exist yet */ }
  return {
    id: session.user.id,
    email: session.user.email,
    name: profile?.name || session.user.user_metadata?.name || '',
    board: profile?.board ?? session.user.user_metadata?.board ?? null,
    tier: profile?.tier ?? session.user.user_metadata?.tier ?? null,
  };
}

if (isCloud) {
  (async () => {
    try {
      const { data } = await supabase.auth.getSession();
      currentUser = await userFromSession(data.session);
    } catch { currentUser = null; }
    ready = true;
    emit();
  })();
  supabase.auth.onAuthStateChange(async (_event, session) => {
    currentUser = await userFromSession(session);
    ready = true;
    emit();
  });
} else {
  localBootstrap();
}

// -------------------------------------------------------------------- public

export async function signUp({ name, email, password, board, tier }) {
  const e = normEmail(email);
  if (!name || !name.trim()) throw new Error('Please enter your name.');
  if (!e || !/^\S+@\S+\.\S+$/.test(e)) throw new Error('Please enter a valid email address.');
  if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');

  if (isCloud) {
    const { data, error } = await supabase.auth.signUp({
      email: e, password,
      options: { data: { name: name.trim(), board: board || null, tier: tier || null } },
    });
    if (error) throw new Error(error.message);
    if (!data.session) {
      // email confirmation is enabled on the project
      throw new Error('Account created — please check your email to confirm, then log in.');
    }
    // create the profile row (RLS lets a user write their own)
    await supabase.from('profiles').upsert({ id: data.user.id, name: name.trim(), board: board || null, tier: tier || null });
    currentUser = await userFromSession(data.session);
    emit();
    return currentUser;
  }

  const users = readUsers();
  if (users[e]) throw new Error('An account with that email already exists. Try logging in.');
  const salt = randomSalt();
  const passwordHash = await hashPassword(password, salt);
  users[e] = { id: e, name: name.trim(), email: e, board: board || null, tier: tier || null, createdAt: new Date().toISOString(), salt, passwordHash };
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, e);
  currentUser = publicUser(users[e]);
  emit();
  return currentUser;
}

export async function logIn({ email, password }) {
  const e = normEmail(email);

  if (isCloud) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: e, password });
    if (error) throw new Error(error.message.includes('Invalid login') ? 'Incorrect email or password.' : error.message);
    currentUser = await userFromSession(data.session);
    emit();
    return currentUser;
  }

  const users = readUsers();
  const rec = users[e];
  if (!rec) throw new Error('No account found with that email. Please sign up first.');
  const hash = await hashPassword(password, rec.salt);
  if (hash !== rec.passwordHash) throw new Error('Incorrect password. Please try again.');
  localStorage.setItem(SESSION_KEY, e);
  currentUser = publicUser(rec);
  emit();
  return currentUser;
}

export async function logOut() {
  if (isCloud) {
    try { await supabase.auth.signOut(); } catch { /* ignore */ }
  } else {
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }
  currentUser = null;
  emit();
}

export async function updateProfile(patch) {
  if (!currentUser) return null;

  if (isCloud) {
    const row = {};
    if (patch.name != null) row.name = String(patch.name).trim();
    if (patch.board !== undefined) row.board = patch.board;
    if (patch.tier !== undefined) row.tier = patch.tier;
    try { await supabase.from('profiles').upsert({ id: currentUser.id, ...row }); } catch { /* offline */ }
    currentUser = { ...currentUser, ...row };
    emit();
    return currentUser;
  }

  const users = readUsers();
  const rec = users[currentUser.id];
  if (!rec) return null;
  if (patch.name != null) rec.name = String(patch.name).trim() || rec.name;
  if (patch.board !== undefined) rec.board = patch.board;
  if (patch.tier !== undefined) rec.tier = patch.tier;
  writeUsers(users);
  currentUser = publicUser(rec);
  emit();
  return currentUser;
}

export async function changePassword(currentPassword, newPassword) {
  if (!currentUser) throw new Error('You are not logged in.');
  if (!newPassword || newPassword.length < 6) throw new Error('New password must be at least 6 characters.');

  if (isCloud) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
    return true;
  }

  const users = readUsers();
  const rec = users[currentUser.id];
  const hash = await hashPassword(currentPassword, rec.salt);
  if (hash !== rec.passwordHash) throw new Error('Your current password is incorrect.');
  rec.salt = randomSalt();
  rec.passwordHash = await hashPassword(newPassword, rec.salt);
  writeUsers(users);
  return true;
}
