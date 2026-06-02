// Progress tracking — stored locally in the browser, namespaced by subject.
// Shape: { [subjectId]: { [topicId]: {attempts, correct, mastery, lastPractised} } }

const KEY = 'gcse-revise:progress:v2';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable (private mode) — fail silently */
  }
}

const blank = () => ({ attempts: 0, correct: 0, mastery: null, lastPractised: null });

export function getProgress(subjectId, topicId) {
  const data = read();
  return data[subjectId]?.[topicId] || blank();
}

export function getSubjectProgress(subjectId) {
  return read()[subjectId] || {};
}

export function getAllProgress() {
  return read();
}

// score: 1 = fully correct, 0.5 = partially correct, 0 = incorrect.
export function recordAttempt(subjectId, topicId, score) {
  const data = read();
  if (!data[subjectId]) data[subjectId] = {};
  const prev = data[subjectId][topicId] || blank();
  const alpha = 0.4; // weight of the most recent attempt
  const mastery = prev.mastery == null ? score : prev.mastery * (1 - alpha) + score * alpha;
  data[subjectId][topicId] = {
    attempts: prev.attempts + 1,
    correct: prev.correct + (score >= 1 ? 1 : 0),
    mastery: Math.round(mastery * 100) / 100,
    lastPractised: new Date().toISOString(),
  };
  write(data);
  return data[subjectId][topicId];
}

export function resetSubject(subjectId) {
  const data = read();
  delete data[subjectId];
  write(data);
}

// --- simple checklist storage for portfolio subjects ---
const CL_KEY = 'gcse-revise:checklist:v1';

export function getChecklist(subjectId) {
  try {
    return JSON.parse(localStorage.getItem(CL_KEY) || '{}')[subjectId] || {};
  } catch {
    return {};
  }
}

export function toggleChecklist(subjectId, index, value) {
  let all = {};
  try {
    all = JSON.parse(localStorage.getItem(CL_KEY) || '{}');
  } catch {
    all = {};
  }
  if (!all[subjectId]) all[subjectId] = {};
  all[subjectId][index] = value;
  try {
    localStorage.setItem(CL_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
  return all[subjectId];
}

export function masteryBand(mastery) {
  if (mastery == null) return { label: 'Not started', tone: 'idle' };
  if (mastery >= 0.8) return { label: 'Secure', tone: 'good' };
  if (mastery >= 0.5) return { label: 'Developing', tone: 'mid' };
  return { label: 'Needs work', tone: 'weak' };
}
