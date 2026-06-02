// All of Juri's GCSE subjects, mapped from the Y10 PPE2 revision guide.
// The Maths topics are reused from topics.js so nothing is duplicated.
// markingStyle drives how the AI writes questions and marks answers:
//   'maths'              – numeric, LaTeX, method marks
//   'science'            – calculations, equations, command words, 6-mark extended response
//   'essay'              – levelled extended written answers (humanities)
//   'english-language'   – AI writes an ORIGINAL extract, then reading/writing AO questions
//   'english-literature' – extract/essay questions (Macbeth quotes OK; no copyrighted novel text)
// mode: 'exam' = practice questions + marking; 'portfolio' = revision checklist + tutor only.

import { TOPICS as MATHS_TOPICS, STRANDS as MATHS_STRANDS } from './topics.js';

const mathsSubject = {
  id: 'maths',
  name: 'Mathematics',
  tier: 'Higher',
  icon: '∑',
  board: 'Edexcel (Pearson)',
  mode: 'exam',
  markingStyle: 'maths',
  paper: 'Papers 1 & 2 · 1h30 each · 90 marks',
  examDate: '2026-06-19',
  examLabel: 'Paper 1: Fri 19 Jun · Paper 2: Mon 22 Jun',
  leadTeacher: 'Mr Hodgson',
  groups: MATHS_STRANDS,
  topics: MATHS_TOPICS.map((t) => ({
    id: t.id, name: t.name, focus: t.focus, group: t.strand, codes: t.sparx,
  })),
};

// helper to build topics quickly
const T = (id, name, focus, group) => ({ id, name, focus, group });

const SUBJECTS = [
  mathsSubject,

  {
    id: 'english-language', name: 'English Language', icon: '✍️',
    board: 'Edexcel (Pearson)', mode: 'exam', markingStyle: 'english-language',
    paper: 'Paper 1 · 1h45 · 64 marks', examDate: '2026-06-17', examLabel: 'Wed 17 Jun',
    leadTeacher: 'Miss Tregelles',
    groups: { reading: { label: 'Section A — Reading', color: '#2F6DB5' }, writing: { label: 'Section B — Writing', color: '#E8623A' } },
    topics: [
      T('lang-q1q2', 'Q1–Q2: Find information (AO1)', 'identifying and listing explicit information and ideas from an unseen fiction extract', 'reading'),
      T('lang-q3', 'Q3: Language & structure (AO2)', 'analysing how the writer uses language and structure to achieve effects on the reader', 'reading'),
      T('lang-q4', 'Q4: Evaluation (AO4)', 'evaluating a statement about the text, supported by references to the extract', 'reading'),
      T('lang-writing', 'Imaginative writing (AO5/AO6)', 'descriptive or narrative writing judged on content, organisation, vocabulary, devices and SPAG', 'writing'),
    ],
  },

  {
    id: 'english-literature', name: 'English Literature', icon: '📖',
    board: 'Edexcel (Pearson)', mode: 'exam', markingStyle: 'english-literature',
    paper: 'Paper 1 · 1h45 · 80 marks', examDate: '2026-06-23', examLabel: 'Tue 23 Jun',
    leadTeacher: 'Miss Tregelles',
    groups: { macbeth: { label: 'Macbeth', color: '#8A4FB0' }, refugee: { label: 'Refugee Boy', color: '#1F8A4C' } },
    topics: [
      T('lit-macbeth-extract', 'Macbeth: extract analysis (Q A)', 'analysing language, structure and form in a given extract from the play', 'macbeth'),
      T('lit-macbeth-theme', 'Macbeth: theme essay (Q B)', 'how the themes of violence, guilt and ambition develop across the play', 'macbeth'),
      T('lit-macbeth-char', 'Macbeth: characters', 'Macbeth, Lady Macbeth, Banquo, the witches and the writer\u2019s intentions', 'macbeth'),
      T('lit-refugee-char', 'Refugee Boy: characters', 'Alem, Mustapha and others \u2014 relationships and the writer\u2019s intentions (discuss without reproducing the novel\u2019s text)', 'refugee'),
      T('lit-refugee-theme', 'Refugee Boy: themes', 'aggression, hope, belonging and identity across the novel', 'refugee'),
    ],
  },

  {
    id: 'biology', name: 'Biology', tier: 'Triple', icon: '🧬',
    board: 'AQA', mode: 'exam', markingStyle: 'science',
    paper: 'Paper 1 · 1h45 · 100 marks', examDate: '2026-06-18', examLabel: 'Thu 18 Jun',
    leadTeacher: 'Mr Velasco',
    groups: { b1: { label: 'B1 Cells', color: '#1F8A4C' }, b2: { label: 'B2 Organisation', color: '#2F6DB5' }, b3: { label: 'B3 Infection & response', color: '#E8623A' }, b4: { label: 'B4 Bioenergetics', color: '#E0A526' } },
    topics: [
      T('bio-b1', 'B1 Cells', 'eukaryotes & prokaryotes, animal/plant cells, specialisation, microscopy, mitosis & the cell cycle, stem cells, diffusion, osmosis, active transport', 'b1'),
      T('bio-b2', 'B2 Organisation', 'the digestive system, enzymes, heart & blood vessels, blood, coronary heart disease, non-communicable disease & lifestyle, cancer, plant tissues & organs', 'b2'),
      T('bio-b3', 'B3 Infection & response', 'communicable diseases, human defence systems, vaccination, antibiotics & painkillers, drug development, monoclonal antibodies, plant diseases & defences', 'b3'),
      T('bio-b4', 'B4 Bioenergetics', 'photosynthesis & its rate, uses of glucose, aerobic & anaerobic respiration, response to exercise, metabolism', 'b4'),
    ],
  },

  {
    id: 'chemistry', name: 'Chemistry', tier: 'Triple', icon: '⚗️',
    board: 'AQA', mode: 'exam', markingStyle: 'science',
    paper: 'Paper 1 · 1h45 · 100 marks', examDate: '2026-06-22', examLabel: 'Mon 22 Jun',
    leadTeacher: 'Mr Hurst',
    groups: { c1: { label: 'C1 Atomic structure', color: '#2F6DB5' }, c2: { label: 'C2 Bonding', color: '#8A4FB0' }, c3: { label: 'C3 Quantitative', color: '#1F8A4C' }, c4: { label: 'C4 Chemical changes', color: '#E8623A' }, c5: { label: 'C5 Energy changes', color: '#E0A526' } },
    topics: [
      T('chem-c1', 'C1 Atomic structure', 'atoms, elements & compounds, development of the atomic model, relative atomic mass, the periodic table, group 1 and group 7', 'c1'),
      T('chem-c2', 'C2 Bonding', 'ionic, covalent and metallic bonding & structures, diamond, graphite, fullerenes, nanoparticles', 'c2'),
      T('chem-c3', 'C3 Quantitative chemistry', 'conservation of mass, relative formula mass, concentration, moles, limiting reactants, reacting masses, % yield, atom economy (HT)', 'c3'),
      T('chem-c4', 'C4 Chemical changes', 'oxidation & reduction, reactivity of metals, acids & alkalis, strong/weak acids, titrations, electrolysis of molten & aqueous compounds', 'c4'),
      T('chem-c5', 'C5 Energy changes', 'exothermic & endothermic reactions, reaction profiles, bond energy calculations (HT)', 'c5'),
    ],
  },

  {
    id: 'physics', name: 'Physics', tier: 'Triple', icon: '🔭',
    board: 'AQA', mode: 'exam', markingStyle: 'science',
    paper: 'Paper 1 · 1h45 · 100 marks', examDate: '2026-06-25', examLabel: 'Thu 25 Jun',
    leadTeacher: 'Mr Axenderrie',
    groups: { p1: { label: 'P1 Energy', color: '#E0A526' }, p2: { label: 'P2 Electricity', color: '#2F6DB5' }, p3: { label: 'P3 Particle model', color: '#1F8A4C' }, p4: { label: 'P4 Atomic structure', color: '#E8623A' } },
    topics: [
      T('phys-p1', 'P1 Energy', 'energy stores & transfers, kinetic/gravitational/elastic potential energy, specific heat capacity, efficiency, power, energy resources', 'p1'),
      T('phys-p2', 'P2 Electricity', 'circuit symbols, Ohm\u2019s law, resistance, LDRs & thermistors, series & parallel circuits, mains electricity, power & energy transfer, national grid, static, fields', 'p2'),
      T('phys-p3', 'P3 Particle model of matter', 'density, specific heat capacity, specific latent heat, gas pressure', 'p3'),
      T('phys-p4', 'P4 Atomic structure', 'development of the atomic model, radioactivity, half-life, contamination vs irradiation, uses, nuclear fission & fusion', 'p4'),
    ],
  },

  {
    id: 'history', name: 'History', icon: '🏛️',
    board: 'Edexcel (Pearson)', mode: 'exam', markingStyle: 'essay',
    paper: 'Weimar & Nazi Germany · 1h30 · 52 marks', examDate: '2026-06-18', examLabel: 'Thu 18 Jun',
    leadTeacher: 'Mrs Rehman',
    groups: { kt1: { label: 'KT1 Weimar Republic 1918–29', color: '#2F6DB5' }, kt2: { label: 'KT2 Hitler\u2019s rise 1919–33', color: '#E8623A' }, kt3: { label: 'KT3 Nazi control 1933–39', color: '#8A4FB0' } },
    topics: [
      T('hist-kt1', 'The Weimar Republic, 1918–29', 'the war ending, early unpopularity & threats, years of unrest, the \u2018Golden Years\u2019, and changes under Weimar', 'kt1'),
      T('hist-kt2', 'Hitler\u2019s rise to power, 1919–33', 'the early Nazi Party, the Munich Putsch, the Great Depression, the rise of the Nazis and Hitler becoming Chancellor', 'kt2'),
      T('hist-kt3', 'Nazi control & dictatorship, 1933–39', 'achieving total power, the machinery of terror, propaganda, control over the church, and opposition', 'kt3'),
    ],
  },

  {
    id: 're', name: 'Religious Education', icon: '🕊️',
    board: 'AQA', mode: 'exam', markingStyle: 'essay',
    paper: 'Islam & Christianity · 1h45 · 102 marks', examDate: '2026-06-16', examLabel: 'Tue 16 Jun',
    leadTeacher: 'Ms Burkinshaw',
    groups: { ib: { label: 'Islam beliefs', color: '#1F8A4C' }, ip: { label: 'Islam practices', color: '#2F6DB5' }, cb: { label: 'Christianity beliefs', color: '#8A4FB0' }, cp: { label: 'Christianity practices', color: '#E0A526' } },
    topics: [
      T('re-islam-beliefs', 'Islam: beliefs', 'nature of God & Tawhid, Sunni & Shia, life after death, predestination, angels, prophets, the Qur\u2019an and holy books', 'ib'),
      T('re-islam-practices', 'Islam: practices', 'the Five Pillars (Shahada, Salah, Zakat, Sawm, Hajj), the 10 obligatory acts, jihad, and festivals (Eid, Ashura)', 'ip'),
      T('re-christ-beliefs', 'Christianity: beliefs', 'nature of God, the Trinity, creation, incarnation, crucifixion, resurrection & ascension, sin and salvation', 'cb'),
      T('re-christ-practices', 'Christianity: practices', 'worship & prayer, sacraments (baptism & Eucharist), pilgrimage, festivals, the local & worldwide church, mission & evangelism', 'cp'),
    ],
  },

  {
    id: 'photography', name: 'Photography', icon: '📷',
    board: 'AQA', mode: 'portfolio', markingStyle: 'essay',
    paper: 'NEA \u2014 \u2018City Life\u2019 · 5h', examDate: null, examLabel: 'Practical exam (5 hours)',
    leadTeacher: 'Mr Fitton',
    checklist: [
      'Contact sheets: produce high-quality contact sheets in Photoshop and select your best images for the theme.',
      'Image analysis: analyse composition, viewpoint, colour and subject in detail.',
      'Editing & manipulation: edit selected images and show clear links to your research.',
      'Tell the story of your edits: from original image through the editing process to the final outcome.',
      'Secondary research: mind maps, mood boards and photographer research with image analysis.',
      'Presentation: present outcomes effectively to showcase your work.',
    ],
  },
];

export const SUBJECTS_LIST = SUBJECTS;
export const SUBJECTS_BY_ID = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));

export function topicsByGroup(subject) {
  const grouped = {};
  for (const key of Object.keys(subject.groups || {})) grouped[key] = [];
  for (const t of subject.topics || []) {
    if (!grouped[t.group]) grouped[t.group] = [];
    grouped[t.group].push(t);
  }
  return grouped;
}

export const PPE = { name: 'Y10 Summer PPE2', window: '15–26 June 2026' };
