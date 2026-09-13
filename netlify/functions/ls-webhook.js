import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

function getAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function verifySignature(body, signature, secret) {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(body);
    const expected = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}

async function findUserByEmail(admin, email) {
  const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 });
  return users?.find((u) => u.email?.toLowerCase() === email.toLowerCase()) || null;
}

const UPGRADE_EVENTS = [
  'subscription_created',
  'subscription_resumed',
  'subscription_updated',
];
const DOWNGRADE_EVENTS = [
  'subscription_cancelled',
  'subscription_expired',
  'subscription_paused',
];

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('LEMON_SQUEEZY_WEBHOOK_SECRET is not set');
    return { statusCode: 500, body: 'Webhook secret not configured' };
  }

  const sig = event.headers['x-signature'];
  if (!sig || !verifySignature(event.body, sig, secret)) {
    console.error('Invalid webhook signature');
    return { statusCode: 401, body: 'Invalid signature' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const eventName = payload.meta?.event_name;
  const attrs = payload.data?.attributes;
  const email = attrs?.user_email;

  console.log(`Lemon Squeezy webhook: ${eventName} for ${email}`);

  if (!email) {
    return { statusCode: 200, body: 'No email in payload — skipped' };
  }

  let plan;
  if (UPGRADE_EVENTS.includes(eventName)) {
    const status = attrs?.status;
    plan = (status === 'active' || status === 'on_trial') ? 'pro' : 'free';
  } else if (DOWNGRADE_EVENTS.includes(eventName)) {
    plan = 'free';
  } else if (eventName === 'order_created' && attrs?.status === 'paid') {
    plan = 'pro';
  } else {
    return { statusCode: 200, body: `Event "${eventName}" not handled — skipped` };
  }

  const admin = getAdmin();
  if (!admin) {
    return { statusCode: 500, body: 'Supabase admin not configured' };
  }

  const user = await findUserByEmail(admin, email);
  if (!user) {
    console.warn(`No GCSEasy account found for ${email}`);
    return { statusCode: 200, body: `No account for ${email} — they may not have signed up yet` };
  }

  const { error } = await admin.from('profiles').upsert({ id: user.id, plan });
  if (error) {
    console.error('Failed to update plan:', error.message);
    return { statusCode: 500, body: 'Failed to update plan' };
  }

  console.log(`Updated ${email} → plan: ${plan}`);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, email, plan }),
  };
};
