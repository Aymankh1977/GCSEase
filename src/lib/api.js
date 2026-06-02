// Client wrappers around the Netlify Functions. The functions hold the
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

export function generateQuestion({ subject, board, markingStyle, topicName, focus, difficulty, exclude }) {
  return postJSON('generate-question', { subject, board, markingStyle, topicName, focus, difficulty, exclude });
}

export function markAnswer({ subject, board, markingStyle, topicName, question, marks, studentAnswer }) {
  return postJSON('mark-answer', { subject, board, markingStyle, topicName, question, marks, studentAnswer });
}

export function tutor({ subject, markingStyle, topicName, messages }) {
  return postJSON('tutor', { subject, markingStyle, topicName, messages });
}
