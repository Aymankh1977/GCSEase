// Per-user progress + checklist storage for GCSEase.
//
// LOCAL-FIRST with optional cloud sync:
//   • An in-memory `cache` backs all the (synchronous) read/write helpers the UI
//     calls, so components don't need to be async.
//   • Every write updates the cache + localStorage immediately (instant, offline-
//     safe), then — in cloud mode — debounce-upserts the whole blob to Supabase.
//   • On login we hydrate the cache from localStorage first (instant), then merge
//     in the cloud copy when it arrives.
//
// Data shape per user:
//   { progress: { [subjectId]: { [topicId]: {attempts, correct, mastery, lastPractised, byDiff} } },
//     checklist: { [subjectId]: { [index]: bool } } }

import { supabase, isCloud } from './supabase.js';
import { getCurrentUser, onAuthChange } from './auth.js';

const PREFIX = 'gcsease:data:';
const GUEST = 'guest';

let cache = { progress: {}, checklist: {} };
let saveTimer = null;

const dataListeners = new Set();
export function onDataChange(l) { dataListeners.add(l); return () => dataListeners.delete(l); }
function emitData() { for (const l of dataListeners) l(); }

function lsKey() {
  const u = getCurrentUser();
  return PREFIX + (u?.id || GUEST);
}

function readLS() {
  try {
    const raw = localStorage.getItem(lsKey());
    const d = raw ? JSON.parse(raw) : {};
    return { progress: d.progress || {}, checklist: d.checklist || {} };
  } catch {
    return { progress: {}, checklist: {} };
  }
}

function writeLS() {
  try { localStorage.setItem(lsKey(), JSON.stringify(cache)); } catch { /* private mode */ }
}

// Merge two data blobs: keep the topic record with more attempts; union checklists.
function merge(a, b) {
  const out = { progress: { ...a.progress }, checklist: { ...a.checklist } };
  for (const [sid, topics] of Object.entries(b.progress || {})) {
    out.progress[sid] = { ...(out.progress[sid] || {}) };
    for (const [tid, rec] of Object.entries(topics)) {
      const existing = out.progress[sid][tid];
      if (!existing || (rec.attempts || 0) >= (existing.attempts || 0)) out.progress[sid][tid] = rec;
    }
  }
  for (const [sid, items] of Object.entries(b.checklist || {})) {
    out.checklist[sid] = { ...(out.checklist[sid] || {}), ...items };
  }
  return out;
}

async function hydrate() {
  cache = readLS(); // instant local copy
  emitData();
  if (isCloud) {
    const u = getCurrentUser();
    if (!u) return;
    try {
      const { data } = await supabase.from('user_data').select('data').eq('user_id', u.id).maybeSingle();
      if (data?.data) {
        cache = merge(cache, data.data);
        writeLS();
        emitData();
      } else {
        // first cloud login for this account — push whatever is local
        persist();
      }
    } catch { /* offline — keep local cache */ }
  }
}

function persist() {
  writeLS();
  if (isCloud) {
    const u = getCurrentUser();
    if (!u) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      supabase.from('user_data')
        .upsert({ user_id: u.id, data: cache, updated_at: new Date().toISOString() })
        .then(() => {}, () => {}); // best-effort; localStorage already has it
    }, 800);
  }
}

// re-hydrate whenever the logged-in user changes, and once at startup
onAuthChange(() => { hydrate(); });
hydrate();

const blank = () => ({ attempts: 0, correct: 0, mastery: null, lastPractised: null, byDiff: {} });

export function getProgress(subjectId, topicId) {
  return cache.progress[subjectId]?.[topicId] || blank();
}

export function getSubjectProgress(subjectId) {
  return cache.progress[subjectId] || {};
}

export function getAllProgress() {
  return cache.progress;
}

// score: 1 = fully correct, 0.5 = partially correct, 0 = incorrect.
// difficulty: 1 = build-up, 2 = standard, 3 = stretch (used for the level estimate).
export function recordAttempt(subjectId, topicId, score, difficulty = 2) {
  if (!cache.progress[subjectId]) cache.progress[subjectId] = {};
  const prev = cache.progress[subjectId][topicId] || blank();
  const alpha = 0.4;
  const mastery = prev.mastery == null ? score : prev.mastery * (1 - alpha) + score * alpha;
  const byDiff = { ...(prev.byDiff || {}) };
  const k = String(difficulty);
  const cur = byDiff[k] || { a: 0, s: 0 };
  byDiff[k] = { a: cur.a + 1, s: Math.round((cur.s + score) * 100) / 100 };
  cache.progress[subjectId][topicId] = {
    attempts: prev.attempts + 1,
    correct: prev.correct + (score >= 1 ? 1 : 0),
    mastery: Math.round(mastery * 100) / 100,
    lastPractised: new Date().toISOString(),
    byDiff,
  };
  persist();
  return cache.progress[subjectId][topicId];
}

// Aggregate practice stats for a subject — feeds the working-grade estimate.
export function getSubjectStats(subjectId) {
  const prog = cache.progress[subjectId] || {};
  const ids = Object.keys(prog);
  let totalAttempts = 0, masterySum = 0, masteryN = 0;
  const byDiff = { 1: { a: 0, s: 0 }, 2: { a: 0, s: 0 }, 3: { a: 0, s: 0 } };
  for (const id of ids) {
    const r = prog[id];
    totalAttempts += r.attempts || 0;
    if (r.mastery != null) { masterySum += r.mastery; masteryN++; }
    for (const d of [1, 2, 3]) {
      const b = r.byDiff?.[d] || r.byDiff?.[String(d)];
      if (b) { byDiff[d].a += b.a || 0; byDiff[d].s += b.s || 0; }
    }
  }
  for (const d of [1, 2, 3]) byDiff[d].rate = byDiff[d].a ? byDiff[d].s / byDiff[d].a : null;
  return { attempted: ids.length, totalAttempts, avgMastery: masteryN ? masterySum / masteryN : null, byDiff };
}

export function resetSubject(subjectId) {
  delete cache.progress[subjectId];
  delete cache.checklist[subjectId];
  persist();
}

// --- checklist storage for portfolio subjects ---
export function getChecklist(subjectId) {
  return cache.checklist[subjectId] || {};
}

export function toggleChecklist(subjectId, index, value) {
  if (!cache.checklist[subjectId]) cache.checklist[subjectId] = {};
  cache.checklist[subjectId][index] = value;
  persist();
  return cache.checklist[subjectId];
}

export function masteryBand(mastery) {
  if (mastery == null) return { label: 'Not started', tone: 'idle' };
  if (mastery >= 0.8) return { label: 'Secure', tone: 'good' };
  if (mastery >= 0.5) return { label: 'Developing', tone: 'mid' };
  return { label: 'Needs work', tone: 'weak' };
}

// --- data recovery: export / import a backup ---
export function exportData() {
  const u = getCurrentUser();
  return {
    app: 'GCSEase',
    version: 1,
    exportedAt: new Date().toISOString(),
    account: u ? { name: u.name, email: u.email, board: u.board, tier: u.tier } : null,
    data: cache,
  };
}

export function importData(payload) {
  if (!payload || typeof payload !== 'object' || !payload.data) {
    throw new Error('That file does not look like a GCSEase backup.');
  }
  cache = merge(cache, payload.data);
  persist();
  emitData();
  return true;
}
