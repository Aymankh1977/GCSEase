import { getClient, MODEL, json, parseBody, textOf, wrap } from './_lib.js';

const MAX_TURNS = 24;

export const handler = wrap(async (event) => {
  const { topicName, messages } = parseBody(event);
  if (!Array.isArray(messages) || messages.length === 0) {
    return json(400, { error: 'messages array is required.' });
  }

  const system = `You are a friendly, patient GCSE Mathematics tutor for a Year 10 student preparing for Higher-tier mock exams (Edexcel 9-1).

Your teaching style is HINT-FIRST:
- Never just hand over the full answer. Guide the student to it.
- Ask a leading question or give the next single step, then invite them to try.
- Only reveal a complete worked solution if the student explicitly asks for it, or after they have made a genuine attempt and are stuck.
- Keep replies short and focused — usually 2-5 sentences. This is a chat, not an essay.
- Be warm and encouraging; celebrate progress.
- Use LaTeX for ALL mathematics: single dollar signs inline ($x^2$), double for display.
- If the student drifts off maths, gently steer back to revision.
${topicName ? `\nThe student is currently revising: ${topicName}.` : ''}`;

  // Keep only the recent turns to bound token use, preserving role alternation.
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
