// Shared helpers for the Netlify Functions.
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// ── Models ────────────────────────────────────────────────────────────────────
// Pro / family users get Sonnet (best quality).
// Free users get Haiku (4× cheaper, still very capable).
const SONNET = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';
const HAIKU  = 'claude-haiku-4-5-20251001';

export const MODEL = SONNET; // kept for backward compat

export function modelForPlan(plan) {
  return (plan === 'pro' || plan === 'family') ? SONNET : HAIKU;
}

// ── Daily limits ──────────────────────────────────────────────────────────────
const LIMITS = {
  free:   { questions: 3,  tutor_msgs: 3  },
  pro:    { questions: 30, tutor_msgs: 30 },
  family: { questions: 30, tutor_msgs: 30 },
};

// ── Anthropic ─────────────────────────────────────────────────────────────────
export function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const err = new Error(
      'ANTHROPIC_API_KEY is not set. Add it in Netlify → Site settings → Environment variables.'
    );
    err.statusCode = 500;
    throw err;
  }
  return new Anthropic({ apiKey });
}

// ── Supabase admin (service role — bypasses RLS) ──────────────────────────────
function getAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Verify the Bearer JWT and return { userId, plan } or null.
export async function verifyUser(authHeader) {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const admin = getAdmin();
  if (!admin) return null;
  try {
    const { data: { user }, error } = await admin.auth.getUser(authHeader.slice(7));
    if (error || !user) return null;
    const { data: profile } = await admin
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .maybeSingle();
    return { userId: user.id, plan: profile?.plan || 'free' };
  } catch {
    return null;
  }
}

// Check the user's daily limit for `type` and increment if within limit.
// Returns { allowed, used, limit }.  Fails open on DB error.
export async function checkAndConsume(userId, plan, type) {
  const admin = getAdmin();
  const limit = LIMITS[plan]?.[type] ?? LIMITS.free[type];
  if (!admin) return { allowed: true, used: 0, limit };

  const today = new Date().toISOString().split('T')[0];
  try {
    const { data } = await admin
      .from('daily_usage')
      .select('questions, tutor_msgs')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    const used = data?.[type] ?? 0;
    if (used >= limit) return { allowed: false, used, limit };

    // Increment the relevant column; keep the other unchanged.
    await admin.from('daily_usage').upsert({
      user_id: userId,
      date: today,
      questions:   type === 'questions'   ? used + 1 : (data?.questions   ?? 0),
      tutor_msgs:  type === 'tutor_msgs'  ? used + 1 : (data?.tutor_msgs  ?? 0),
    });

    return { allowed: true, used: used + 1, limit };
  } catch {
    return { allowed: true, used: 0, limit }; // fail open
  }
}

// ── Shared utilities ──────────────────────────────────────────────────────────
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

export function textOf(message) {
  return (message.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

export function extractJSON(text) {
  let t = text.trim();
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
