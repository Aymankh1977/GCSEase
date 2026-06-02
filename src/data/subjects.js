// All of Juri's GCSE subjects, mapped from the Y10 PPE2 revision guide.
// The Maths topics are reused from topics.js so nothing is duplicated.
// markingStyle drives how the AI writes questions and marks answers:
//   'maths'              – numeric, LaTeX, method marks
//   'science'            – calculations, equations, command words, 6-mark extended response
//   'essay'              – levelled extended written answers (humanities & vocational)
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
      T('lang-writing', 'Imaginative writing (AO5/AO6)', 'descriptive or narrative writing judged on content, organisation, vocabulary, devices and SPaG', 'writing'),
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
    id: 'geography', name: 'Geography', icon: '🌍',
    board: 'AQA', mode: 'exam', markingStyle: 'essay',
    paper: 'Paper 1 · 1h30 · 88 marks', examDate: '2026-06-17', examLabel: 'Wed 17 Jun',
    leadTeacher: 'Miss Austin',
    groups: { hazards: { label: 'Natural hazards', color: '#E8623A' }, living: { label: 'The living world', color: '#1F8A4C' }, uk: { label: 'UK physical landscapes', color: '#2F6DB5' } },
    topics: [
      T('geo-hazards', 'Challenges of natural hazards', 'tectonic hazards (Nepal & New Zealand), weather hazards & tropical storms (Typhoon Haiyan, Somerset floods), climate change causes/effects/management', 'hazards'),
      T('geo-living', 'The living world', 'ecosystems & nutrient cycles, tropical rainforests (Amazon) and hot deserts (Sahara) \u2014 adaptations, deforestation/desertification, sustainable management', 'living'),
      T('geo-uk', 'Physical landscapes in the UK', 'coasts (Swanage Bay, Lyme Regis) and rivers (River Tees) \u2014 erosion, transport, deposition, landforms and management strategies', 'uk'),
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
    id: 'business-gcse', name: 'Business (GCSE)', icon: '📈',
    board: 'Edexcel (Pearson)', mode: 'exam', markingStyle: 'essay',
    paper: 'Theme 1 · 1h45 · 90 marks', examDate: '2026-06-23', examLabel: 'Tue 23 Jun',
    leadTeacher: 'Mrs Moore',
    groups: { t: { label: 'Theme 1', color: '#E0A526' } },
    topics: [
      T('bus-1-1', '1.1 Enterprise & entrepreneurship', 'purpose of business activity, the role & characteristics of an entrepreneur, business ideas, risk vs reward, the dynamic nature of business', 't'),
      T('bus-1-2', '1.2 Spotting a business opportunity', 'customer needs, market research (primary/secondary, quantitative/qualitative), market segmentation, understanding competition', 't'),
      T('bus-1-3', '1.3 Putting an idea into practice', 'aims & objectives, revenue, costs, profit & loss, cash flow, sources of finance, break-even analysis, the importance of planning', 't'),
      T('bus-1-4', '1.4 Making the business effective', 'ownership types, location factors, the marketing mix (4Ps), and the benefits of a business plan', 't'),
      T('bus-1-5', '1.5 External influences', 'stakeholders, technology, legislation (employment & consumer law), the economy (interest/exchange rates, inflation, unemployment)', 't'),
    ],
  },

  {
    id: 'business-ncfe', name: 'Business (NCFE)', icon: '💼',
    board: 'NCFE', mode: 'exam', markingStyle: 'essay',
    paper: 'CA1–CA4 · 1h30 · 80 marks', examDate: '2026-06-23', examLabel: 'Tue 23 Jun',
    leadTeacher: 'Mrs Moore',
    groups: { g: { label: 'Core content', color: '#2F6DB5' } },
    topics: [
      T('ncfe-org', 'Organisation, structure & ownership', 'sole traders, partnerships and limited companies \u2014 responsibility and control', 'g'),
      T('ncfe-marketing', 'Marketing & customers', 'identifying customer needs and the marketing mix (price, product, place, promotion)', 'g'),
      T('ncfe-research', 'Market research & data', 'primary vs secondary research and qualitative vs quantitative data', 'g'),
      T('ncfe-production', 'Production & lean manufacturing', 'job, batch and flow production, and Just-In-Time (JIT) / lean manufacturing', 'g'),
      T('ncfe-people', 'People & strategy', 'human resources & motivation, the Boston Matrix, business location, stakeholders, and types of contract', 'g'),
    ],
  },

  {
    id: 'design-technology', name: 'Design & Technology', icon: '📐',
    board: 'AQA', mode: 'exam', markingStyle: 'science',
    paper: 'Paper 1 · 2h · 100 marks', examDate: '2026-06-24', examLabel: 'Wed 24 Jun',
    leadTeacher: 'Ms McBride',
    groups: { mat: { label: 'Materials & manufacture', color: '#E8623A' }, des: { label: 'Designing principles', color: '#2F6DB5' }, mech: { label: 'Mechanisms & maths', color: '#1F8A4C' }, hs: { label: 'Safety & communication', color: '#E0A526' } },
    topics: [
      T('dt-materials', 'Materials & their properties', 'metals (pure vs alloys), thermoplastics vs thermosetting polymers, composites, timber & fibres, papers & boards, and matching properties to uses', 'mat'),
      T('dt-manufacture', 'Manufacturing & sustainability', 'stock forms, surface finishes, industrial production methods, quality control, raw-material sourcing, carbon footprint and finite vs renewable resources', 'mat'),
      T('dt-design', 'Designing principles', 'user needs vs wants, innovation, design fixation, researching existing products, focus groups, product analysis and the influence of designers', 'des'),
      T('dt-human', 'Human factors', 'anthropometrics, ergonomics, inclusive design and accessibility (e.g. seat height, reach, comfort)', 'des'),
      T('dt-mechanisms', 'Mechanisms, systems & maths', 'levers & mechanical advantage, electronic systems, inputs/processes/outputs, plus area, volume, costings, percentages and unit conversions', 'mech'),
      T('dt-communication', 'Drawing, communication & safety', 'third-angle orthographic projection, plan/front/side views, scale & annotation, workshop safety, PPE and risk assessment', 'hs'),
    ],
  },

  {
    id: 'food-cookery', name: 'Food & Cookery', icon: '🍳',
    board: 'NCFE', mode: 'exam', markingStyle: 'essay',
    paper: 'Paper 1 · 1h30 · 80 marks', examDate: '2026-06-19', examLabel: 'Fri 19 Jun',
    leadTeacher: 'Mrs Stack',
    groups: { g: { label: 'Units 1–6', color: '#1F8A4C' } },
    topics: [
      T('food-safety', 'Unit 1: Health & safety', 'health, safety and hygiene relating to food, nutrition and the cooking environment', 'g'),
      T('food-legislation', 'Unit 2: Legislation & provenance', 'food legislation, labelling and food provenance', 'g'),
      T('food-nutrients', 'Unit 3: Nutrients & a balanced diet', 'food groups, key nutrients and the principles of a balanced diet', 'g'),
      T('food-skills', 'Unit 5: Preparation & cooking skills', 'food preparation, cooking skills and techniques', 'g'),
      T('food-development', 'Unit 6: Recipe development', 'amending, developing and evaluating recipes', 'g'),
    ],
  },

  {
    id: 'imedia', name: 'iMedia', icon: '💻',
    board: 'OCR', mode: 'exam', markingStyle: 'essay',
    paper: 'Theory CA1–CA5 · approx. 1h', examDate: '2026-06-15', examLabel: 'Mon 15 Jun',
    leadTeacher: 'Ms Rashid',
    groups: { g: { label: 'CA1–CA5', color: '#8A4FB0' } },
    topics: [
      T('imedia-ca1', 'CA1: Types of products', 'types of interactive media products and their features', 'g'),
      T('imedia-ca2', 'CA2: Audiences', 'the audiences of interactive media products and their needs', 'g'),
      T('imedia-ca3', 'CA3: Software & hardware', 'software and hardware options for creating interactive media', 'g'),
      T('imedia-ca4', 'CA4: Planning & proposals', 'product planning, proposals and pre-production documents', 'g'),
      T('imedia-ca5', 'CA5: Development', 'developing an interactive media product and documenting the process', 'g'),
    ],
  },

  {
    id: 'art', name: 'Art', icon: '🎨',
    board: 'WJEC', mode: 'portfolio', markingStyle: 'essay',
    paper: 'NEA \u2014 \u2018City Life\u2019 final piece · 5h', examDate: null, examLabel: 'Practical exam (5 hours)',
    leadTeacher: 'Mrs Aspden',
    checklist: [
      'Visual connection: create work inspired by your chosen artist, using similar media or techniques on your own subject.',
      'Personal primary sources: base work on your own photos and observations.',
      'Development: show how studying the artist shaped your creative journey.',
      'Detailed annotation: explain how the artist influenced your choices (materials, colour, composition) \u2014 AO1.',
      'Analysis: discuss the artist\u2019s techniques, materials and themes (texture, tone, composition, context).',
      'Final piece: plan and refine a final outcome using media you are skilful in.',
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
