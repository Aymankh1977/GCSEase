// Shared helpers for the Netlify Functions.
// Files prefixed with "_" are not exposed as endpoints but are bundled when imported.
import Anthropic from '@anthropic-ai/sdk';

export const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

export function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const err = new Error(
      'ANTHROPIC_API_KEY is not set. Add it in Netlify (Site settings → Environment variables) or in a local .env file.'
    );
    err.statusCode = 500;
    throw err;
  }
  return new Anthropic({ apiKey });
}

export function json(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

export function parseBody(event) {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch {
    return {};
  }
}

// Collect all text blocks from a Messages API response.
export function textOf(message) {
  return (message.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

// Extract a JSON object from a model reply, tolerating ```json fences or prose.
export function extractJSON(text) {
  let t = text.trim();
  // strip code fences
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  try {
    return JSON.parse(t);
  } catch {
    const start = t.indexOf('{');
    const end = t.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(t.slice(start, end + 1));
    }
    throw new Error('Could not parse a JSON object from the model response.');
  }
}

// Standard wrapper: method guard + uniform error handling.
export function wrap(handler) {
  return async (event) => {
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Method not allowed. Use POST.' });
    }
    try {
      return await handler(event);
    } catch (err) {
      const status = err.statusCode || (err.status ? err.status : 500);
      return json(status, { error: err.message || 'Internal error' });
    }
  };
}
