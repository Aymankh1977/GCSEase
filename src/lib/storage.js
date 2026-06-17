// Per-user progress + checklist storage for GCSEase.
//
// All data is namespaced by the logged-in account, so each student keeps their
// own progress on the device and gets it back when they log in again. The shape
// stored under each user is:
//   { progress: { [subjectId]: { [topicId]: {attempts, correct, mastery, lastPractised} } },
//     checklist: { [subjectId]: { [index]: bool } } }

import { getCurrentUser } from './auth.js';

const PREFIX = 'gcsease:data:';
const GUEST = 'guest';

function keyFor() {
  const u = getCurrentUser();
  return PREFIX + (u?.id || GUEST);
}

function readAll() {
  try {
    const raw = localStorage.getItem(keyFor());
    const data = raw ? JSON.parse(raw) : {};
    if (!data.progress) data.progress = {};
    if (!data.checklist) data.checklist = {};
    return data;
  } catch {
    return { progress: {}, checklist: {} };
  }
}

function writeAll(data) {
  try { localStorage.setItem(keyFor(), JSON.stringify(data)); } catch { /* storage unavailable */ }
}

const blank = () => ({ attempts: 0, correct: 0, mastery: null, lastPractised: null, byDiff: {} });

export function getProgress(subjectId, topicId) {
  return readAll().progress[subjectId]?.[topicId] || blank();
}

export function getSubjectProgress(subjectId) {
  return readAll().progress[subjectId] || {};
}

export function getAllProgress() {
  return readAll().progress;
}

// score: 1 = fully correct, 0.5 = partially correct, 0 = incorrect.
// difficulty: 1 = build-up, 2 = standard, 3 = stretch (used for the level estimate).
export function recordAttempt(subjectId, topicId, score, difficulty = 2) {
  const data = readAll();
  if (!data.progress[subjectId]) data.progress[subjectId] = {};
  const prev = data.progress[subjectId][topicId] || blank();
  const alpha = 0.4; // weight of the most recent attempt
  const mastery = prev.mastery == null ? score : prev.mastery * (1 - alpha) + score * alpha;
  const byDiff = { ...(prev.byDiff || {}) };
  const k = String(difficulty);
  const cur = byDiff[k] || { a: 0, s: 0 };
  byDiff[k] = { a: cur.a + 1, s: Math.round((cur.s + score) * 100) / 100 };
  data.progress[subjectId][topicId] = {
    attempts: prev.attempts + 1,
    correct: prev.correct + (score >= 1 ? 1 : 0),
    mastery: Math.round(mastery * 100) / 100,
    lastPractised: new Date().toISOString(),
    byDiff,
  };
  writeAll(data);
  return data.progress[subjectId][topicId];
}

// Aggregate practice stats for a subject — feeds the working-grade estimate.
export function getSubjectStats(subjectId) {
  const prog = readAll().progress[subjectId] || {};
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
  const data = readAll();
  delete data.progress[subjectId];
  delete data.checklist[subjectId];
  writeAll(data);
}

// --- checklist storage for portfolio subjects ---
export function getChecklist(subjectId) {
  return readAll().checklist[subjectId] || {};
}

export function toggleChecklist(subjectId, index, value) {
  const data = readAll();
  if (!data.checklist[subjectId]) data.checklist[subjectId] = {};
  data.checklist[subjectId][index] = value;
  writeAll(data);
  return data.checklist[subjectId];
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
    data: readAll(),
  };
}

export function importData(payload) {
  if (!payload || typeof payload !== 'object' || !payload.data) {
    throw new Error('That file does not look like a GCSEase backup.');
  }
  const incoming = payload.data;
  const current = readAll();
  // merge: keep the better mastery / higher attempt count per topic
  const merged = { progress: { ...current.progress }, checklist: { ...current.checklist } };
  for (const [sid, topics] of Object.entries(incoming.progress || {})) {
    merged.progress[sid] = { ...(merged.progress[sid] || {}) };
    for (const [tid, rec] of Object.entries(topics)) {
      const existing = merged.progress[sid][tid];
      if (!existing || (rec.attempts || 0) >= (existing.attempts || 0)) merged.progress[sid][tid] = rec;
    }
  }
  for (const [sid, items] of Object.entries(incoming.checklist || {})) {
    merged.checklist[sid] = { ...(merged.checklist[sid] || {}), ...items };
  }
  writeAll(merged);
  return true;
}
