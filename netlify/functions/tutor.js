import { getClient, MODEL, json, parseBody, textOf, wrap } from './_lib.js';

const MAX_TURNS = 16; // smaller, since messages may carry images/PDFs

// Allow only text / image / document blocks through to the API.
function sanitizeContent(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    const blocks = content
      .filter((b) => b && (b.type === 'text' || b.type === 'image' || b.type === 'document'))
      .map((b) => {
        if (b.type === 'text') return { type: 'text', text: String(b.text || '') };
        return { type: b.type, source: b.source };
      });
    return blocks.length ? blocks : '';
  }
  return '';
}

export const handler = wrap(async (event) => {
  const { subject, topicName, messages } = parseBody(event);
  if (!Array.isArray(messages) || messages.length === 0) {
    return json(400, { error: 'messages array is required.' });
  }

  const system = `You are a friendly, patient UK GCSE ${subject || ''} tutor for a Year 10 student preparing for Higher-tier mock exams.

Your teaching style is HINT-FIRST for practice questions: guide with a leading question or the next single step, then invite the student to try, and only give the full answer if they ask or after a genuine attempt.

BUT when the student shares a handout, photo of notes, diagram or PDF and asks to UNDERSTAND a concept, switch to clear teaching mode: explain the concept simply and step by step in your own words, define key terms, use a small example, and connect it to what the exam expects. Finish by checking understanding with one short question.

Keep replies focused and readable. Use LaTeX for any mathematics or formulae (single $...$ inline, double $$...$$ display). If an image is unclear, say what you can and ask for a clearer photo. Be warm and encouraging.
${topicName ? `\nThe student is currently focusing on: ${topicName}.` : ''}`;

  const trimmed = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: sanitizeContent(m.content) }))
    .filter((m) => m.content && (typeof m.content === 'string' ? m.content.trim() : m.content.length));

  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 1100,
    temperature: 0.6,
    system,
    messages: trimmed,
  });

  return json(200, { reply: textOf(msg) });
});
