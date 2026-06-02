import { getClient, MODEL, json, parseBody, textOf, extractJSON, wrap } from './_lib.js';

function markGuidance(markingStyle) {
  switch (markingStyle) {
    case 'maths':
      return `Mark like an Edexcel maths examiner: award method marks for valid working even if the final answer is wrong. Use LaTeX for maths. Provide a clear worked solution as numbered steps.`;
    case 'science':
      return `Mark like an AQA science examiner: reward correct points, working, units and use of command words. For extended answers, judge against levels. Use LaTeX for any equations. Provide a concise model answer / mark-scheme points.`;
    case 'english-language':
      return `Mark like an English Language examiner using the relevant assessment objectives (AO1 information, AO2 language & structure, AO4 evaluation, or AO5/AO6 for writing). Comment on what hit the level and what would push it higher. Provide indicative content / a model paragraph, not a full essay.`;
    case 'english-literature':
      return `Mark like an English Literature examiner using levels (AO1 response & references, AO2 methods, AO3 context). Praise specific strengths and name one concrete improvement. Provide indicative content (key points & quotations to use), not a full essay.`;
    default: // essay — humanities & vocational
      return `Mark like a GCSE examiner using a levels-based mark scheme appropriate to the command word and tariff. Reward knowledge, application, analysis and (where relevant) evaluation/judgement. Provide indicative content / model points rather than a long essay.`;
  }
}

export const handler = wrap(async (event) => {
  const { subject, markingStyle = 'essay', topicName, question, marks = 3, studentAnswer } = parseBody(event);
  if (!question || studentAnswer == null) {
    return json(400, { error: 'question and studentAnswer are required.' });
  }

  const system = `You are a supportive but rigorous UK GCSE ${subject || ''} examiner marking a Year 10 mock answer.

${markGuidance(markingStyle)}

Always be warm and encouraging, address the student as "you", and be specific about where marks were won or lost. Respond with ONLY a JSON object, no prose and no code fences.`;

  const user = `Subject: ${subject || 'GCSE'}
Topic: ${topicName || ''}
Marks available: ${marks}

QUESTION:
${question}

STUDENT'S ANSWER:
${studentAnswer}

Return JSON exactly in this shape:
{
  "score": 0 | 0.5 | 1,
  "verdict": "<short one-line headline>",
  "feedback": "<2-4 sentences of specific, encouraging feedback>",
  "workedSolution": "<worked solution or indicative content / model points, using \\n between steps>"
}
Score 1 = full or nearly full marks, 0.5 = partial credit, 0 = little or no credit.`;

  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 1300,
    temperature: 0.2,
    system,
    messages: [{ role: 'user', content: user }],
  });

  const data = extractJSON(textOf(msg));
  let score = Number(data.score);
  if (![0, 0.5, 1].includes(score)) score = score >= 0.75 ? 1 : score >= 0.25 ? 0.5 : 0;

  return json(200, {
    score,
    verdict: data.verdict || (score === 1 ? 'Strong answer' : score === 0.5 ? 'Partially there' : 'Not quite yet'),
    feedback: data.feedback || '',
    workedSolution: data.workedSolution || '',
  });
});
