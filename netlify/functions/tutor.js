import { getClient, MODEL, json, parseBody, textOf, wrap } from './_lib.js';

const MAX_TURNS = 24;

export const handler = wrap(async (event) => {
  const { subject, topicName, messages } = parseBody(event);
  if (!Array.isArray(messages) || messages.length === 0) {
    return json(400, { error: 'messages array is required.' });
  }

  const system = `You are a friendly, patient UK GCSE ${subject || ''} tutor for a Year 10 student preparing for Higher-tier mock exams.

Your teaching style is HINT-FIRST:
- Never just hand over the full answer. Guide the student to it with a leading question or the next single step, then invite them to try.
- Only give a complete worked answer if they explicitly ask, or after a genuine attempt.
- Keep replies short and focused (usually 2–5 sentences). This is a chat, not an essay.
- Be warm and encouraging; celebrate progress.
- Use LaTeX for any mathematics or formulae (single $...$ inline, double $$...$$ display).
- Gently steer back to revision if the student drifts off-topic.
${topicName ? `\nThe student is currently revising: ${topicName}.` : ''}`;

  const trimmed = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_TURNS);

  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 700,
    temperature: 0.6,
    system,
    messages: trimmed,
  });

  return json(200, { reply: textOf(msg) });
});
