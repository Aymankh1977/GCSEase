// Progress tracking — stored locally in the browser (no account / server needed for v1).
// Each topic accumulates attempts, correct answers, a rolling confidence score and
// the last-practised timestamp. The dashboard derives weak areas from this.

const KEY = 'gcse-math-revise:progress:v1';

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
    /* storage may be unavailable (private mode); fail silently */
  }
}

export function getProgress(topicId) {
  const data = read();
  return (
    data[topicId] || {
      attempts: 0,
      correct: 0,
      // mastery is an EWMA of correctness in [0,1]; null = never attempted
      mastery: null,
      lastPractised: null,
    }
  );
}

export function getAllProgress() {
  return read();
}

// score: 1 = fully correct, 0.5 = partially correct, 0 = incorrect.
export function recordAttempt(topicId, score) {
  const data = read();
  const prev = data[topicId] || { attempts: 0, correct: 0, mastery: null, lastPractised: null };
  const alpha = 0.4; // weighting for the most recent attempt
  const mastery = prev.mastery == null ? score : prev.mastery * (1 - alpha) + score * alpha;
  data[topicId] = {
    attempts: prev.attempts + 1,
    correct: prev.correct + (score >= 1 ? 1 : 0),
    mastery: Math.round(mastery * 100) / 100,
    lastPractised: new Date().toISOString(),
  };
  write(data);
  return data[topicId];
}

export function resetProgress() {
  write({});
}

// Convert a mastery value into a friendly band.
export function masteryBand(mastery) {
  if (mastery == null) return { label: 'Not started', tone: 'idle' };
  if (mastery >= 0.8) return { label: 'Secure', tone: 'good' };
  if (mastery >= 0.5) return { label: 'Developing', tone: 'mid' };
  return { label: 'Needs work', tone: 'weak' };
}
