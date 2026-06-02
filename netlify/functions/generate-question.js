import { getClient, MODEL, json, parseBody, textOf, extractJSON, wrap } from './_lib.js';

const DIFFICULTY_LABEL = {
  1: 'foundational / grade 3-4 — short, single-step or two-step',
  2: 'standard / grade 5-6 — multi-step, the typical Higher question',
  3: 'stretch / grade 7-9 — multi-step problem solving, reasoning or proof',
};

export const handler = wrap(async (event) => {
  const { topicName, focus, difficulty = 2, exclude = [] } = parseBody(event);
  if (!topicName) return json(400, { error: 'topicName is required.' });

  const level = DIFFICULTY_LABEL[difficulty] || DIFFICULTY_LABEL[2];
  const avoid = Array.isArray(exclude) && exclude.length
    ? `\nDo NOT repeat any of these recently-used questions:\n- ${exclude.slice(-6).join('\n- ')}`
    : '';

  const system = `You are an experienced UK GCSE Mathematics teacher writing exam-style questions for the Edexcel (Pearson) Level 1/2 GCSE (9-1) Higher tier. You write for Year 10 students sitting a mock (PPE) exam.

Rules:
- Write ONE self-contained question on the requested topic only.
- Match the requested difficulty band exactly.
- Use realistic GCSE phrasing and a sensible mark allocation (1-6 marks).
- Use LaTeX for ALL mathematics, delimited by single dollar signs for inline and double dollar signs for display. Example: $3x + 2 = 11$.
- Do NOT include the answer, hints, or working — only the question.
- If a diagram would normally be given, describe it briefly in words instead (do not attempt ASCII art).
- Respond with ONLY a JSON object, no prose and no code fences.`;

  const user = `Topic: ${topicName}
Key focus: ${focus || topicName}
Difficulty: ${level}${avoid}

Return JSON exactly in this shape:
{"question": "<the full question text with LaTeX>", "marks": <integer 1-6>}`;

  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 700,
    temperature: 0.9,
    system,
    messages: [{ role: 'user', content: user }],
  });

  const data = extractJSON(textOf(msg));
  if (!data.question) return json(502, { error: 'Model did not return a question.' });
  return json(200, {
    question: String(data.question),
    marks: Number(data.marks) || 3,
  });
});
