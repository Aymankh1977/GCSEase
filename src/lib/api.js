// Thin client wrappers around the Netlify Functions. The functions hold the
// Anthropic API key server-side — the browser never sees it.

const BASE = '/.netlify/functions';

async function postJSON(path, body) {
  const res = await fetch(`${BASE}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Unexpected response from ${path}: ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    throw new Error(data.error || `Request to ${path} failed (${res.status})`);
  }
  return data;
}

// Returns { question, marks, hintCount } for a topic at a difficulty (1-3).
export function generateQuestion({ topicId, topicName, focus, difficulty, exclude }) {
  return postJSON('generate-question', { topicId, topicName, focus, difficulty, exclude });
}

// Returns { score, verdict, feedback, workedSolution } for a student's answer.
export function markAnswer({ topicName, question, marks, studentAnswer }) {
  return postJSON('mark-answer', { topicName, question, marks, studentAnswer });
}

// Conversational hint-first tutor. messages = [{role, content}, ...].
export function tutor({ topicName, messages }) {
  return postJSON('tutor', { topicName, messages });
}
