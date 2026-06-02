import { getClient, MODEL, json, parseBody, textOf, extractJSON, wrap } from './_lib.js';

export const handler = wrap(async (event) => {
  const { topicName, question, marks = 3, studentAnswer } = parseBody(event);
  if (!question || studentAnswer == null) {
    return json(400, { error: 'question and studentAnswer are required.' });
  }

  const system = `You are a supportive but rigorous UK GCSE Mathematics examiner marking a Year 10 Higher-tier mock answer. You follow Edexcel mark-scheme principles: award method marks for valid working even when the final answer is wrong.

Marking guidance:
- Decide a fair score: 1 = fully correct, 0.5 = partially correct (right method, slip or incomplete), 0 = incorrect or no valid method.
- Give warm, specific, encouraging feedback in plain English. Point to exactly where it went right or wrong.
- Never be harsh. Address the student directly as "you".
- Always provide a clear, concise worked solution as a numbered sequence of steps.
- Use LaTeX for ALL mathematics: single dollars inline, double dollars for display.
- Respond with ONLY a JSON object, no prose and no code fences.`;

  const user = `Topic: ${topicName || 'GCSE Maths'}
Marks available: ${marks}

QUESTION:
${question}

STUDENT'S ANSWER:
${studentAnswer}

Return JSON exactly in this shape:
{
  "score": 0 | 0.5 | 1,
  "verdict": "<a short one-line headline, e.g. 'Correct — well done!' or 'Nearly — one slip'>",
  "feedback": "<2-4 sentences of specific, encouraging feedback with LaTeX where helpful>",
  "workedSolution": "<the full worked solution, using \\n between numbered steps and LaTeX for maths>"
}`;

  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 1200,
    temperature: 0.2,
    system,
    messages: [{ role: 'user', content: user }],
  });

  const data = extractJSON(textOf(msg));
  let score = Number(data.score);
  if (![0, 0.5, 1].includes(score)) score = score >= 0.75 ? 1 : score >= 0.25 ? 0.5 : 0;

  return json(200, {
    score,
    verdict: data.verdict || (score === 1 ? 'Correct' : score === 0.5 ? 'Partially correct' : 'Not quite'),
    feedback: data.feedback || '',
    workedSolution: data.workedSolution || '',
  });
});
