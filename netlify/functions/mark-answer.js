import { getClient, MODEL, json, parseBody, textOf, extractJSON, wrap } from './_lib.js';

function markGuidance(markingStyle) {
  switch (markingStyle) {
    case 'maths':
      return `Mark like an Edexcel maths examiner: award method marks for valid working even if the final answer is wrong. Use LaTeX for maths. Give a clear worked solution as numbered steps.`;
    case 'science':
      return `Mark like an AQA science examiner: reward correct points, working, units and use of command words. For extended answers, judge against levels. Use LaTeX for any equations. Give concise model-answer / mark-scheme points.`;
    case 'english-language':
      return `Mark like an English Language examiner using the relevant assessment objectives (AO1, AO2, AO4, or AO5/AO6 for writing). Say what hit the level and what would push it higher. Give indicative content / a model paragraph, not a full essay.`;
    case 'english-literature':
      return `Mark like an English Literature examiner using levels (AO1 response & references, AO2 methods, AO3 context). Praise specific strengths and name one concrete improvement. Give indicative content (key points & quotations), not a full essay.`;
    default: // essay — humanities & vocational
      return `Mark like a GCSE examiner using a levels-based mark scheme appropriate to the command word and tariff. Reward knowledge, application, analysis and (where relevant) evaluation. Give indicative content / model points rather than a long essay.`;
  }
}

export const handler = wrap(async (event) => {
  const body = parseBody(event);
  const { subject, markingStyle = 'essay', topicName, context = '' } = body;

  // Accept the multi-part shape, or fall back to the old single-question shape.
  let parts = Array.isArray(body.parts) ? body.parts : null;
  if (!parts && body.question != null) {
    parts = [{ label: '', prompt: body.question, marks: body.marks || 3, answer: body.studentAnswer }];
  }
  if (!parts || !parts.length) return json(400, { error: 'parts (or question) are required.' });

  const totalMarks = parts.reduce((s, p) => s + (Number(p.marks) || 0), 0);

  const partsBlock = parts.map((p, i) => {
    const lbl = p.label ? `(${p.label})` : `Part ${i + 1}`;
    return `${lbl} [${p.marks} mark${p.marks === 1 ? '' : 's'}]
QUESTION: ${p.prompt}
STUDENT ANSWER: ${p.answer && String(p.answer).trim() ? p.answer : '(no answer given)'}`;
  }).join('\n\n');

  const system = `You are a supportive but rigorous UK GCSE ${subject || ''} examiner marking a Year 10 mock answer.

${markGuidance(markingStyle)}

Mark EACH part separately, awarding marks out of that part's tariff, then give an overall judgement for the whole question. Always be warm and encouraging, address the student as "you", and be specific about where marks were won or lost. Respond with ONLY a JSON object, no prose and no code fences.`;

  const user = `Subject: ${subject || 'GCSE'}
Topic: ${topicName || ''}
Total marks available: ${totalMarks}
${context ? `\nShared context:\n${context}\n` : ''}
The question has ${parts.length} part(s):

${partsBlock}

Return JSON exactly in this shape:
{
  "parts": [ {"label": "a", "awarded": <number from 0 to that part's marks>, "marks": <integer>, "comment": "<one or two sentences, specific and encouraging>"} ],
  "score": 0 | 0.5 | 1,
  "verdict": "<short one-line headline for the whole question>",
  "feedback": "<2-3 sentences overall, encouraging>",
  "workedSolution": "<model answer / indicative content covering EVERY part, using \\n between parts>"
}
Overall score: 1 = full or nearly full marks across the whole question, 0.5 = partial credit, 0 = little or no credit.`;

  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 1600,
    temperature: 0.2,
    system,
    messages: [{ role: 'user', content: user }],
  });

  const data = extractJSON(textOf(msg));
  let score = Number(data.score);
  if (![0, 0.5, 1].includes(score)) score = score >= 0.75 ? 1 : score >= 0.25 ? 0.5 : 0;

  const rparts = Array.isArray(data.parts)
    ? data.parts.map((p) => ({
        label: String(p.label ?? ''),
        awarded: Number(p.awarded) || 0,
        marks: Number(p.marks) || 0,
        comment: String(p.comment || ''),
      }))
    : [];

  return json(200, {
    score,
    verdict: data.verdict || (score === 1 ? 'Strong answer' : score === 0.5 ? 'Partially there' : 'Not quite yet'),
    parts: rparts,
    feedback: data.feedback || '',
    workedSolution: data.workedSolution || '',
  });
});
