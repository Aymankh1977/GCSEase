import { getClient, MODEL, json, parseBody, textOf, extractJSON, wrap } from './_lib.js';

const DIFFICULTY = {
  1: 'foundational (grade 3–4): short, one or two steps',
  2: 'standard (grade 5–6): the typical multi-step exam question',
  3: 'stretch (grade 7–9): demanding problem-solving, analysis or evaluation',
};

function styleGuidance(markingStyle) {
  switch (markingStyle) {
    case 'maths':
      return `Write ONE exam-style maths question. Use LaTeX for ALL mathematics (single $...$ inline, double $$...$$ display). Give a sensible mark tariff (1–6). Describe any diagram in words. Do not include the answer.`;
    case 'science':
      return `Write ONE exam-style question. Use proper units and command words (state, describe, explain, calculate, evaluate). Calculations may appear; use LaTeX for any formulae/equations ($...$). For higher difficulty, a 6-mark extended-response question is ideal. Mark tariff 1–6. Describe any diagram in words. Do not include the answer.`;
    case 'english-language':
      return `If the topic is a READING skill: first WRITE YOUR OWN ORIGINAL short fiction extract (roughly 120–180 words — your own writing, never copied from any real text), then ask the matching exam question for that assessment objective. If the topic is WRITING: give a single imaginative writing task (a title or short scenario). Put any extract inside the "question" field, clearly separated from the task. Mark tariff appropriate to the question (writing tasks ~40). Do not include a model answer.`;
    case 'english-literature':
      return `Write ONE exam-style question. For MACBETH you may quote a short extract (Shakespeare is out of copyright). For REFUGEE BOY you must NOT reproduce any text from the novel — set a theme or character essay question instead. Mark tariff appropriate (~20–40). Do not include a model answer.`;
    default: // 'essay' — humanities & vocational
      return `Write ONE exam-style question using an appropriate GCSE command word (e.g. "Describe", "Explain", "Outline", "Analyse", "Evaluate", "To what extent"). Choose a realistic mark tariff (commonly 2, 4, 8, 9, 12 or 16). Do not include a model answer.`;
  }
}

export const handler = wrap(async (event) => {
  const { subject, board, markingStyle = 'essay', topicName, focus, difficulty = 2, exclude = [] } = parseBody(event);
  if (!subject || !topicName) return json(400, { error: 'subject and topicName are required.' });

  const level = DIFFICULTY[difficulty] || DIFFICULTY[2];
  const avoid = Array.isArray(exclude) && exclude.length
    ? `\nDo NOT repeat any of these recently-used questions:\n- ${exclude.slice(-6).join('\n- ')}`
    : '';

  const system = `You are an experienced UK GCSE ${subject} teacher writing exam-style questions${board ? ` for the ${board} specification` : ''}. You write for a Year 10 student sitting a mock (PPE) exam.

${styleGuidance(markingStyle)}

Match the requested difficulty band exactly. Keep questions self-contained and realistic. Respond with ONLY a JSON object, no prose and no code fences.`;

  const user = `Subject: ${subject}
Topic: ${topicName}
Focus: ${focus || topicName}
Difficulty: ${level}${avoid}

Return JSON exactly in this shape:
{"question": "<the full question, including any original extract if needed>", "marks": <integer>}`;

  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 900,
    temperature: 0.9,
    system,
    messages: [{ role: 'user', content: user }],
  });

  const data = extractJSON(textOf(msg));
  if (!data.question) return json(502, { error: 'Model did not return a question.' });
  return json(200, { question: String(data.question), marks: Number(data.marks) || 3 });
});
