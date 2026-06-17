// Account + session handling for GCSEase.
//
// This is a CLIENT-SIDE account store: accounts and their data live in the
// browser's localStorage, so a student's progress is kept on this device and
// is restored whenever they log back in. Passwords are salted + hashed with the
// Web Crypto API (SHA-256) — we never store the raw password.
//
// "Regain your data": every account can export an encrypted-looking JSON backup
// (see lib/storage.js → exportData) and import it on another device. When the
// app is later given a real backend, only this file and storage.js need to
// change — the rest of the UI talks to these helpers.

const USERS_KEY = 'gcsease:users:v1';
const SESSION_KEY = 'gcsease:session:v1';

const listeners = new Set();
function emit() { const u = getCurrentUser(); listeners.forEach((l) => l(u)); }
export function onAuthChange(l) { listeners.add(l); return () => listeners.delete(l); }

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch { return {}; }
}
function writeUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch { /* private mode */ }
}

const normEmail = (e) => String(e || '').trim().toLowerCase();

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

// Public, safe shape of a user (no password material).
function publicUser(rec) {
  if (!rec) return null;
  const { passwordHash, salt, ...safe } = rec;
  return safe;
}

export function getCurrentUser() {
  try {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return null;
    return publicUser(readUsers()[id]) || null;
  } catch {
    return null;
  }
}

export async function signUp({ name, email, password, board, tier }) {
  const e = normEmail(email);
  if (!name || !name.trim()) throw new Error('Please enter your name.');
  if (!e || !/^\S+@\S+\.\S+$/.test(e)) throw new Error('Please enter a valid email address.');
  if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');

  const users = readUsers();
  if (users[e]) throw new Error('An account with that email already exists. Try logging in.');

  const salt = randomSalt();
  const passwordHash = await hashPassword(password, salt);
  users[e] = {
    id: e,
    name: name.trim(),
    email: e,
    board: board || null,
    tier: tier || null,
    createdAt: new Date().toISOString(),
    salt,
    passwordHash,
  };
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, e);
  emit();
  return publicUser(users[e]);
}

export async function logIn({ email, password }) {
  const e = normEmail(email);
  const users = readUsers();
  const rec = users[e];
  if (!rec) throw new Error('No account found with that email. Please sign up first.');
  const hash = await hashPassword(password, rec.salt);
  if (hash !== rec.passwordHash) throw new Error('Incorrect password. Please try again.');
  localStorage.setItem(SESSION_KEY, e);
  emit();
  return publicUser(rec);
}

export function logOut() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  emit();
}

// Update mutable profile fields (name, chosen board, chosen tier).
export function updateProfile(patch) {
  const cur = getCurrentUser();
  if (!cur) return null;
  const users = readUsers();
  const rec = users[cur.id];
  if (!rec) return null;
  if (patch.name != null) rec.name = String(patch.name).trim() || rec.name;
  if (patch.board !== undefined) rec.board = patch.board;
  if (patch.tier !== undefined) rec.tier = patch.tier;
  writeUsers(users);
  emit();
  return publicUser(rec);
}

export async function changePassword(currentPassword, newPassword) {
  const cur = getCurrentUser();
  if (!cur) throw new Error('You are not logged in.');
  if (!newPassword || newPassword.length < 6) throw new Error('New password must be at least 6 characters.');
  const users = readUsers();
  const rec = users[cur.id];
  const hash = await hashPassword(currentPassword, rec.salt);
  if (hash !== rec.passwordHash) throw new Error('Your current password is incorrect.');
  rec.salt = randomSalt();
  rec.passwordHash = await hashPassword(newPassword, rec.salt);
  writeUsers(users);
  return true;
}
