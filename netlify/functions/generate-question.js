import { getClient, MODEL, json, parseBody, textOf, extractJSON, wrap } from './_lib.js';

const DIFFICULTY = {
  1: 'foundational (grade 3–4): short, one or two steps',
  2: 'standard (grade 5–6): the typical multi-step exam question',
  3: 'stretch (grade 7–9): demanding problem-solving, analysis or evaluation',
};

function styleGuidance(markingStyle) {
  switch (markingStyle) {
    case 'maths':
      return `Write an exam-style maths question (it may have parts). Use LaTeX for ALL mathematics (single $...$ inline, double $$...$$ display). Give a sensible mark tariff per part (1–6 each).`;
    case 'science':
      return `Write an exam-style question (it may have parts). Use proper units and command words (state, describe, explain, calculate, evaluate). Use LaTeX for any formulae/equations ($...$). A 6-mark extended-response part is good for higher difficulty.`;
    case 'english-language':
      return `If the topic is a READING skill: first WRITE YOUR OWN ORIGINAL short fiction extract (roughly 120–180 words — your own writing, never copied), put it in "context", then ask the matching exam question as the part(s). If the topic is WRITING: give a single imaginative writing task. Mark tariff appropriate (writing tasks ~40).`;
    case 'english-literature':
      return `Write an exam-style question. For MACBETH you may quote a short extract (out of copyright) in "context". For REFUGEE BOY do NOT reproduce any text — set a theme or character essay question instead. Mark tariff ~20–40.`;
    default: // 'essay' — humanities & vocational
      return `Write an exam-style question using appropriate GCSE command words ("Describe", "Explain", "Outline", "Analyse", "Evaluate", "To what extent"). Realistic tariff per part (commonly 2, 4, 8, 9, 12 or 16).`;
  }
}

// Detects references to a VISUAL (diagram/figure/graph/image/chart/map) that the
// app cannot display — while allowing the student to be ASKED to draw one, and
// allowing data that is written out in the text ("results shown below: ...").
function refersToMissingVisual(text) {
  const t = String(text || '');
  const VISUAL = '(diagram|figure|image|photograph|photo|picture|illustration|graph|chart|map)';
  const patterns = [
    new RegExp(`\\b(the|this|following)\\s+${VISUAL}\\b`, 'i'),
    new RegExp(`\\b${VISUAL}\\s+(above|below|shown|opposite|provided)\\b`, 'i'),
    new RegExp(`\\b(refer to|use|using|see|from|in)\\s+the\\s+${VISUAL}\\b`, 'i'),
  ];
  const produce = /\b(draw|plot|sketch|construct|complete|label|create|produce|make|add to)\b/i;
  for (const re of patterns) {
    const m = t.match(re);
    if (m) {
      const before = t.slice(Math.max(0, m.index - 32), m.index);
      if (!produce.test(before)) return true; // a reference to something not provided
    }
  }
  return false;
}

function buildParts(data) {
  let parts = Array.isArray(data.parts) ? data.parts : [];
  parts = parts
    .filter((p) => p && (p.prompt || p.text))
    .map((p) => ({ label: String(p.label ?? '').trim(), prompt: String(p.prompt ?? p.text).trim(), marks: Number(p.marks) || 1 }));
  if (!parts.length && data.question) {
    parts = [{ label: '', prompt: String(data.question), marks: Number(data.marks) || 3 }];
  }
  return parts;
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

SELF-CONTAINED — VERY IMPORTANT: every question must be fully answerable from text alone. NEVER refer to a diagram, figure, graph, image, photograph, map or chart that is "shown", "below", "above" or "provided" — nothing can be displayed to the student. If data is needed, write it out in words/numbers in "context" (a small text data list is fine). You MAY ask the student to draw or sketch their own diagram/graph as part of their answer. Do not write "the diagram shows", "use the graph", "in the figure" or "see the chart".

If the question naturally has several parts, return them as SEPARATE parts, each with its own prompt and marks (label them a, b, c). Otherwise return a single part. Put any shared introduction/data/extract in "context".

Match the requested difficulty band exactly. Respond with ONLY a JSON object, no prose and no code fences.`;

  const user = `Subject: ${subject}
Topic: ${topicName}
Focus: ${focus || topicName}
Difficulty: ${level}${avoid}

Return JSON exactly in this shape:
{"context": "<shared intro/data/extract, or empty string>", "parts": [{"label": "a", "prompt": "<part text>", "marks": <integer>}]}
Use a single part with "label": "" when the question is not multi-part. Use LaTeX where appropriate.`;

  const client = getClient();
  let best = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const sys = attempt === 0
      ? system
      : `${system}\n\nYour previous attempt referred to a diagram/figure/graph/chart that cannot be displayed. Rewrite the question so it is 100% answerable from the text: remove every reference to a visual, and instead write any required data out as numbers/words in "context".`;
    const msg = await client.messages.create({
      model: MODEL, max_tokens: 1100, temperature: 0.9, system: sys,
      messages: [{ role: 'user', content: user }],
    });
    const data = extractJSON(textOf(msg));
    const parts = buildParts(data);
    if (!parts.length) continue;
    const marks = parts.reduce((s, p) => s + (Number(p.marks) || 0), 0) || 3;
    best = { context: String(data.context || ''), parts, marks };
    const blob = [best.context, ...parts.map((p) => p.prompt)].join(' \n ');
    if (!refersToMissingVisual(blob)) break; // clean — use it
  }
  if (!best) return json(502, { error: 'Model did not return a question.' });
  return json(200, best);
});
