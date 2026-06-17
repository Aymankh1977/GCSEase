// The UK GCSE exam boards. Different boards set different specifications, so
// the board a student picks is passed to the AI when it writes/marks questions.
// Reference: the main awarding bodies recognised across England, Wales and NI.

export const BOARDS = [
  {
    id: 'aqa',
    name: 'AQA',
    full: 'Assessment and Qualifications Alliance',
    region: 'England',
    color: '#2F6DB5',
    blurb: 'The largest exam board in England — used by most secondary schools.',
  },
  {
    id: 'edexcel',
    name: 'Edexcel (Pearson)',
    full: 'Pearson Edexcel',
    region: 'England',
    color: '#E8623A',
    blurb: 'Run by Pearson; popular for Maths, Sciences and languages.',
  },
  {
    id: 'ocr',
    name: 'OCR',
    full: 'Oxford, Cambridge and RSA Examinations',
    region: 'England',
    color: '#8A4FB0',
    blurb: 'Part of Cambridge Assessment; strong in Sciences and Computer Science.',
  },
  {
    id: 'eduqas',
    name: 'WJEC / Eduqas',
    full: 'WJEC and its England-facing brand Eduqas',
    region: 'Wales & England',
    color: '#1F8A4C',
    blurb: 'WJEC is the main board in Wales; Eduqas is its England-regulated brand.',
  },
  {
    id: 'ccea',
    name: 'CCEA',
    full: 'Council for the Curriculum, Examinations & Assessment',
    region: 'Northern Ireland',
    color: '#E0A526',
    blurb: 'The awarding body for Northern Ireland.',
  },
];

export const BOARDS_BY_ID = Object.fromEntries(BOARDS.map((b) => [b.id, b]));

export function boardName(id) {
  return BOARDS_BY_ID[id]?.name || id || 'Your exam board';
}
