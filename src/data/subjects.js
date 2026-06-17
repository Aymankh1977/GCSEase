// The GCSEase subject catalogue — the GCSE subjects offered across the UK.
//
// Subjects here are board-NEUTRAL: the student chooses an exam board and (for
// tiered subjects) a tier elsewhere, and those choices are passed to the AI so
// it tailors questions and marking. That keeps one clean topic list per subject
// instead of a copy per board.
//
// markingStyle drives how the AI writes/marks:
//   'maths'              – numeric, LaTeX, method marks
//   'science'            – calculations, equations, command words, 6-mark extended response
//   'essay'              – levelled extended written answers (humanities/social sciences)
//   'language'           – modern foreign language (reading/translation/writing)
//   'english-language'   – AI writes an ORIGINAL extract, then reading/writing AO questions
//   'english-literature' – extract/essay questions (set-text themes; no copyrighted prose)
//   'practical'          – coursework/NEA-style guidance (uses portfolio mode)
//
// tiered: true  → student sits Foundation or Higher (Maths, Sciences, reformed MFLs)
// mode:   'exam' = practice questions + marking; 'portfolio' = revision checklist + tutor only.

import { TOPICS as MATHS_TOPICS, STRANDS as MATHS_STRANDS } from './topics.js';

const T = (id, name, focus, group) => ({ id, name, focus, group });

const mathsSubject = {
  id: 'maths',
  name: 'Mathematics',
  icon: '∑',
  category: 'Core',
  tiered: true,
  mode: 'exam',
  markingStyle: 'maths',
  paper: 'Three papers · 1h30 each (one non-calculator)',
  groups: MATHS_STRANDS,
  topics: MATHS_TOPICS.map((t) => ({ id: t.id, name: t.name, focus: t.focus, group: t.strand, codes: t.sparx })),
};

const SUBJECTS = [
  mathsSubject,

  {
    id: 'english-language', name: 'English Language', icon: '✍️', category: 'Core',
    tiered: false, mode: 'exam', markingStyle: 'english-language',
    paper: 'Two papers · reading & writing',
    groups: { reading: { label: 'Reading (AO1–AO4)', color: '#2F6DB5' }, writing: { label: 'Writing (AO5–AO6)', color: '#E8623A' } },
    topics: [
      T('lang-info', 'Retrieve information (AO1)', 'identifying and listing explicit information and ideas from an unseen extract', 'reading'),
      T('lang-language', 'Language analysis (AO2)', 'how a writer uses words, phrases, language techniques and sentence forms for effect', 'reading'),
      T('lang-structure', 'Structure analysis (AO2)', 'how a whole text is structured — openings, shifts in focus, endings — to interest the reader', 'reading'),
      T('lang-compare', 'Comparing texts (AO3)', 'comparing writers’ ideas and perspectives, and how they are conveyed, across two texts', 'reading'),
      T('lang-evaluate', 'Evaluation (AO4)', 'evaluating a statement about a text with a critical, personal response and evidence', 'reading'),
      T('lang-descriptive', 'Descriptive & narrative writing (AO5/6)', 'imaginative writing judged on content, organisation, vocabulary, devices and accuracy', 'writing'),
      T('lang-transactional', 'Transactional writing (AO5/6)', 'writing to argue, persuade or inform — letters, articles, speeches — for purpose and audience', 'writing'),
    ],
  },

  {
    id: 'english-literature', name: 'English Literature', icon: '📖', category: 'Core',
    tiered: false, mode: 'exam', markingStyle: 'english-literature',
    paper: 'Two papers · prose, drama, poetry',
    groups: { shakespeare: { label: 'Shakespeare', color: '#8A4FB0' }, novel: { label: '19th-century / modern prose', color: '#1F8A4C' }, poetry: { label: 'Poetry', color: '#2F6DB5' } },
    topics: [
      T('lit-shake-extract', 'Shakespeare: extract & whole play', 'analysing language, form and structure in a given extract and linking to the play as a whole', 'shakespeare'),
      T('lit-shake-theme', 'Shakespeare: themes & characters', 'how key themes and characters develop, and the writer’s intentions and context', 'shakespeare'),
      T('lit-novel-theme', 'Prose: themes', 'exploring themes across a studied novel (discuss without reproducing copyrighted text)', 'novel'),
      T('lit-novel-char', 'Prose: characters', 'how characters and relationships are presented and what the writer suggests through them', 'novel'),
      T('lit-poetry-anthology', 'Poetry anthology comparison', 'comparing two poems’ ideas, methods and effects from a studied cluster', 'poetry'),
      T('lit-poetry-unseen', 'Unseen poetry', 'analysing and comparing previously unseen poems for meaning, methods and effect', 'poetry'),
    ],
  },

  {
    id: 'combined-science', name: 'Combined Science', icon: '🔬', category: 'Core',
    tiered: true, mode: 'exam', markingStyle: 'science',
    paper: 'Six papers · worth two GCSEs',
    groups: { bio: { label: 'Biology', color: '#1F8A4C' }, chem: { label: 'Chemistry', color: '#8A4FB0' }, phys: { label: 'Physics', color: '#2F6DB5' } },
    topics: [
      T('cs-cells', 'Cell biology', 'eukaryotes/prokaryotes, microscopy, mitosis, stem cells, diffusion, osmosis, active transport', 'bio'),
      T('cs-organisation', 'Organisation', 'enzymes, the digestive and circulatory systems, health and disease, plant tissues', 'bio'),
      T('cs-infection', 'Infection & response', 'pathogens, the immune system, vaccination, drugs', 'bio'),
      T('cs-bioenergetics', 'Bioenergetics', 'photosynthesis and respiration, factors affecting rate', 'bio'),
      T('cs-atomic', 'Atomic structure & periodic table', 'atoms, isotopes, the development of the model, the periodic table, groups 1 and 7', 'chem'),
      T('cs-bonding', 'Bonding & structure', 'ionic, covalent and metallic bonding and the properties they give', 'chem'),
      T('cs-quant', 'Quantitative chemistry', 'conservation of mass, relative formula mass, moles, concentration, reacting masses', 'chem'),
      T('cs-changes', 'Chemical & energy changes', 'reactivity, acids and alkalis, electrolysis, exothermic/endothermic reactions', 'chem'),
      T('cs-energy', 'Energy', 'energy stores and transfers, efficiency, power, specific heat capacity, resources', 'phys'),
      T('cs-electricity', 'Electricity', 'circuits, Ohm’s law, resistance, series and parallel, mains electricity, power', 'phys'),
      T('cs-particle', 'Particle model & forces', 'density, states of matter, forces, motion, speed, acceleration', 'phys'),
      T('cs-waves', 'Waves & atomic structure', 'wave properties, the EM spectrum, radioactivity and half-life', 'phys'),
    ],
  },

  {
    id: 'biology', name: 'Biology', icon: '🧬', category: 'Sciences',
    tiered: true, mode: 'exam', markingStyle: 'science',
    paper: 'Two papers · separate science',
    groups: { b1: { label: 'Cells & organisation', color: '#1F8A4C' }, b2: { label: 'Infection, bioenergetics', color: '#2F6DB5' }, b3: { label: 'Homeostasis & response', color: '#E8623A' }, b4: { label: 'Inheritance, evolution, ecology', color: '#E0A526' } },
    topics: [
      T('bio-cells', 'Cell biology', 'cell structure, microscopy, mitosis and the cell cycle, stem cells, transport in and out of cells', 'b1'),
      T('bio-organisation', 'Organisation', 'enzymes, the digestive system, the heart and blood vessels, non-communicable disease, plant organs', 'b1'),
      T('bio-infection', 'Infection & response', 'communicable disease, human defences, vaccination, antibiotics, monoclonal antibodies', 'b2'),
      T('bio-bioenergetics', 'Bioenergetics', 'photosynthesis and its rate, aerobic and anaerobic respiration, metabolism', 'b2'),
      T('bio-homeostasis', 'Homeostasis & response', 'the nervous system, reflexes, hormones, blood glucose control, the menstrual cycle', 'b3'),
      T('bio-inheritance', 'Inheritance, variation & evolution', 'DNA, genetic crosses, sexual/asexual reproduction, evolution, selective breeding, classification', 'b4'),
      T('bio-ecology', 'Ecology', 'ecosystems, sampling, the carbon and water cycles, biodiversity, human impacts', 'b4'),
    ],
  },

  {
    id: 'chemistry', name: 'Chemistry', icon: '⚗️', category: 'Sciences',
    tiered: true, mode: 'exam', markingStyle: 'science',
    paper: 'Two papers · separate science',
    groups: { c1: { label: 'Atomic structure & bonding', color: '#8A4FB0' }, c2: { label: 'Quantitative & changes', color: '#1F8A4C' }, c3: { label: 'Rates, organic, analysis', color: '#E8623A' }, c4: { label: 'Atmosphere & resources', color: '#2F6DB5' } },
    topics: [
      T('chem-atomic', 'Atomic structure & periodic table', 'atoms, isotopes, electronic structure, the development of the model, groups 0, 1 and 7', 'c1'),
      T('chem-bonding', 'Bonding, structure & properties', 'ionic, covalent and metallic bonding, giant structures, nanoparticles, states of matter', 'c1'),
      T('chem-quant', 'Quantitative chemistry', 'conservation of mass, moles, concentration, reacting masses, % yield, atom economy', 'c2'),
      T('chem-changes', 'Chemical changes', 'reactivity series, acids and alkalis, neutralisation, titrations, electrolysis', 'c2'),
      T('chem-energy', 'Energy changes', 'exothermic and endothermic reactions, reaction profiles, bond energy calculations', 'c2'),
      T('chem-rates', 'Rates & equilibrium', 'rate of reaction, collision theory, catalysts, reversible reactions, Le Chatelier', 'c3'),
      T('chem-organic', 'Organic chemistry', 'crude oil, alkanes and alkenes, cracking, polymers, alcohols and carboxylic acids', 'c3'),
      T('chem-analysis', 'Chemical analysis', 'pure substances, formulations, chromatography, tests for gases and ions', 'c3'),
      T('chem-atmosphere', 'Chemistry of the atmosphere', 'evolution of the atmosphere, greenhouse gases, climate change, pollutants', 'c4'),
      T('chem-resources', 'Using resources', 'potable water, life-cycle assessment, recycling, the Haber process', 'c4'),
    ],
  },

  {
    id: 'physics', name: 'Physics', icon: '🔭', category: 'Sciences',
    tiered: true, mode: 'exam', markingStyle: 'science',
    paper: 'Two papers · separate science',
    groups: { p1: { label: 'Energy & electricity', color: '#E0A526' }, p2: { label: 'Particles & atoms', color: '#1F8A4C' }, p3: { label: 'Forces & motion', color: '#E8623A' }, p4: { label: 'Waves, magnetism, space', color: '#2F6DB5' } },
    topics: [
      T('phys-energy', 'Energy', 'energy stores and transfers, kinetic/GPE/elastic energy, specific heat capacity, efficiency, power, resources', 'p1'),
      T('phys-electricity', 'Electricity', 'circuit symbols, Ohm’s law, resistance, series and parallel, mains electricity, the national grid, static', 'p1'),
      T('phys-particle', 'Particle model of matter', 'density, internal energy, specific heat capacity, specific latent heat, gas pressure', 'p2'),
      T('phys-atomic', 'Atomic structure & radioactivity', 'the nuclear model, isotopes, radioactive decay, half-life, fission and fusion', 'p2'),
      T('phys-forces', 'Forces', 'scalars and vectors, resultant forces, work, Hooke’s law, moments, pressure', 'p3'),
      T('phys-motion', 'Motion & Newton’s laws', 'speed, velocity, acceleration, distance-time and velocity-time graphs, Newton’s laws, stopping distances, momentum', 'p3'),
      T('phys-waves', 'Waves', 'transverse and longitudinal waves, wave speed, reflection and refraction, the EM spectrum, lenses', 'p4'),
      T('phys-magnetism', 'Magnetism & electromagnetism', 'magnetic fields, electromagnets, the motor effect, generators and transformers', 'p4'),
      T('phys-space', 'Space physics', 'the life cycle of stars, the solar system, orbits and red-shift', 'p4'),
    ],
  },

  {
    id: 'geography', name: 'Geography', icon: '🌍', category: 'Humanities',
    tiered: false, mode: 'exam', markingStyle: 'essay',
    paper: 'Three papers · physical, human, fieldwork',
    groups: { physical: { label: 'Physical geography', color: '#1F8A4C' }, human: { label: 'Human geography', color: '#2F6DB5' }, skills: { label: 'Skills & fieldwork', color: '#E0A526' } },
    topics: [
      T('geo-hazards', 'Natural hazards', 'tectonic hazards, plate boundaries, weather hazards, tropical storms, climate change', 'physical'),
      T('geo-ecosystems', 'Ecosystems & biomes', 'tropical rainforests and hot deserts — characteristics, adaptations and management', 'physical'),
      T('geo-rivers-coasts', 'Rivers & coasts', 'fluvial and coastal processes, landforms, flooding and management strategies', 'physical'),
      T('geo-urban', 'Urban issues & challenges', 'urbanisation, megacities, a UK city case study, sustainable urban living', 'human'),
      T('geo-development', 'The changing economic world', 'measuring development, the development gap, reducing it, an NEE case study', 'human'),
      T('geo-resources', 'Resource management', 'food, water and energy supply and demand and management', 'human'),
      T('geo-skills', 'Geographical skills & fieldwork', 'maps, graphs, GIS, data presentation, and evaluating fieldwork enquiries', 'skills'),
    ],
  },

  {
    id: 'history', name: 'History', icon: '🏛️', category: 'Humanities',
    tiered: false, mode: 'exam', markingStyle: 'essay',
    paper: 'Period, depth, thematic & source studies',
    groups: { period: { label: 'Period & depth studies', color: '#E8623A' }, thematic: { label: 'Thematic studies', color: '#8A4FB0' }, source: { label: 'Source & interpretation skills', color: '#2F6DB5' } },
    topics: [
      T('hist-modern-depth', 'Modern depth study', 'e.g. Weimar & Nazi Germany or the USA — key events, causation and significance', 'period'),
      T('hist-period', 'Period study', 'a broad sweep such as the American West or Superpower relations and the Cold War', 'period'),
      T('hist-thematic', 'Thematic study', 'change and continuity over time, e.g. health and medicine or crime and punishment', 'thematic'),
      T('hist-british-depth', 'British depth study', 'e.g. Norman England or Elizabethan England — society, government and challenges', 'thematic'),
      T('hist-sources', 'Source analysis', 'usefulness, reliability and provenance of historical sources', 'source'),
      T('hist-interpretations', 'Interpretations', 'how and why historians and others interpret the past differently', 'source'),
    ],
  },

  {
    id: 'rs', name: 'Religious Studies', icon: '🕊️', category: 'Humanities',
    tiered: false, mode: 'exam', markingStyle: 'essay',
    paper: 'Two papers · beliefs, practices & themes',
    groups: { beliefs: { label: 'Beliefs & teachings', color: '#8A4FB0' }, practices: { label: 'Practices', color: '#1F8A4C' }, themes: { label: 'Religious, philosophical & ethical themes', color: '#E0A526' } },
    topics: [
      T('rs-christianity-beliefs', 'Christianity: beliefs & teachings', 'God, the Trinity, creation, incarnation, crucifixion, resurrection, salvation', 'beliefs'),
      T('rs-christianity-practices', 'Christianity: practices', 'worship, sacraments, prayer, pilgrimage, festivals, the role of the church', 'practices'),
      T('rs-islam-beliefs', 'Islam: beliefs & teachings', 'Tawhid, the nature of God, prophethood, holy books, angels, life after death', 'beliefs'),
      T('rs-islam-practices', 'Islam: practices', 'the Five Pillars, the Ten Obligatory Acts, jihad, and festivals', 'practices'),
      T('rs-relationships', 'Theme: relationships & families', 'marriage, divorce, gender roles, and contrasting religious views', 'themes'),
      T('rs-peace', 'Theme: peace & conflict', 'just war, pacifism, terrorism, and forgiveness and reconciliation', 'themes'),
      T('rs-crime', 'Theme: crime & punishment', 'causes of crime, aims of punishment, the death penalty and forgiveness', 'themes'),
    ],
  },

  {
    id: 'french', name: 'French', icon: '🇫🇷', category: 'Languages',
    tiered: true, mode: 'exam', markingStyle: 'language',
    paper: 'Listening, speaking, reading, writing',
    groups: { identity: { label: 'Identity & culture', color: '#2F6DB5' }, local: { label: 'Local, national & global', color: '#1F8A4C' }, study: { label: 'Study & employment', color: '#E0A526' } },
    topics: [
      T('fr-family', 'Family & relationships', 'describing family, friends and relationships; opinions and reasons', 'identity'),
      T('fr-freetime', 'Free time & technology', 'hobbies, sport, music, TV, social media and mobile technology', 'identity'),
      T('fr-home', 'Home, town & region', 'where you live, your house, your local area and what there is to do', 'local'),
      T('fr-environment', 'Environment & global issues', 'environmental problems, poverty, and how to help', 'local'),
      T('fr-holidays', 'Travel & holidays', 'past, present and future holidays, transport and accommodation', 'local'),
      T('fr-school', 'School & education', 'your school, subjects, rules, the school day and opinions', 'study'),
      T('fr-work', 'Future plans, work & careers', 'jobs, ambitions, work experience and future study', 'study'),
      T('fr-grammar', 'Grammar & translation', 'tenses, agreement and translating between French and English', 'study'),
    ],
  },

  {
    id: 'spanish', name: 'Spanish', icon: '🇪🇸', category: 'Languages',
    tiered: true, mode: 'exam', markingStyle: 'language',
    paper: 'Listening, speaking, reading, writing',
    groups: { identity: { label: 'Identity & culture', color: '#E8623A' }, local: { label: 'Local, national & global', color: '#1F8A4C' }, study: { label: 'Study & employment', color: '#E0A526' } },
    topics: [
      T('es-family', 'Family & relationships', 'describing family, friends and relationships; opinions and reasons', 'identity'),
      T('es-freetime', 'Free time & technology', 'hobbies, sport, music, TV, social media and mobile technology', 'identity'),
      T('es-home', 'Home, town & region', 'where you live, your house, your local area and what there is to do', 'local'),
      T('es-environment', 'Environment & global issues', 'environmental problems, poverty, and how to help', 'local'),
      T('es-holidays', 'Travel & holidays', 'past, present and future holidays, transport and accommodation', 'local'),
      T('es-school', 'School & education', 'your school, subjects, rules, the school day and opinions', 'study'),
      T('es-work', 'Future plans, work & careers', 'jobs, ambitions, work experience and future study', 'study'),
      T('es-grammar', 'Grammar & translation', 'tenses, agreement and translating between Spanish and English', 'study'),
    ],
  },

  {
    id: 'german', name: 'German', icon: '🇩🇪', category: 'Languages',
    tiered: true, mode: 'exam', markingStyle: 'language',
    paper: 'Listening, speaking, reading, writing',
    groups: { identity: { label: 'Identity & culture', color: '#E0A526' }, local: { label: 'Local, national & global', color: '#1F8A4C' }, study: { label: 'Study & employment', color: '#2F6DB5' } },
    topics: [
      T('de-family', 'Family & relationships', 'describing family, friends and relationships; opinions and reasons', 'identity'),
      T('de-freetime', 'Free time & technology', 'hobbies, sport, music, TV, social media and mobile technology', 'identity'),
      T('de-home', 'Home, town & region', 'where you live, your house, your local area and what there is to do', 'local'),
      T('de-environment', 'Environment & global issues', 'environmental problems, poverty, and how to help', 'local'),
      T('de-holidays', 'Travel & holidays', 'past, present and future holidays, transport and accommodation', 'local'),
      T('de-school', 'School & education', 'your school, subjects, rules, the school day and opinions', 'study'),
      T('de-work', 'Future plans, work & careers', 'jobs, ambitions, work experience and future study', 'study'),
      T('de-grammar', 'Grammar & translation', 'cases, word order and translating between German and English', 'study'),
    ],
  },

  {
    id: 'computer-science', name: 'Computer Science', icon: '💻', category: 'STEM',
    tiered: false, mode: 'exam', markingStyle: 'essay',
    paper: 'Theory & programming papers',
    groups: { theory: { label: 'Computer systems', color: '#2F6DB5' }, problem: { label: 'Algorithms & programming', color: '#E8623A' }, data: { label: 'Data & networks', color: '#1F8A4C' } },
    topics: [
      T('cs-architecture', 'Systems architecture', 'the CPU, the fetch-execute cycle, registers, and factors affecting performance', 'theory'),
      T('cs-memory', 'Memory & storage', 'RAM, ROM, virtual memory, secondary storage and units of data', 'theory'),
      T('cs-networks', 'Networks & topologies', 'LANs and WANs, protocols, the TCP/IP stack, topologies and the internet', 'data'),
      T('cs-security', 'System security & software', 'malware, social engineering, prevention, and system/utility software', 'data'),
      T('cs-binary', 'Data representation', 'binary, hexadecimal, binary arithmetic, characters, images and sound', 'data'),
      T('cs-algorithms', 'Algorithms', 'computational thinking, searching and sorting algorithms, flowcharts and pseudocode', 'problem'),
      T('cs-programming', 'Programming fundamentals', 'variables, selection, iteration, data types, operators, arrays and subprograms', 'problem'),
      T('cs-defensive', 'Producing robust programs', 'defensive design, input validation, testing and refining code', 'problem'),
    ],
  },

  {
    id: 'business', name: 'Business', icon: '📈', category: 'Social sciences',
    tiered: false, mode: 'exam', markingStyle: 'essay',
    paper: 'Influences on, and operations of, business',
    groups: { enterprise: { label: 'Enterprise & marketing', color: '#E0A526' }, operations: { label: 'Operations & finance', color: '#1F8A4C' }, people: { label: 'People & influences', color: '#2F6DB5' } },
    topics: [
      T('bus-enterprise', 'Enterprise & entrepreneurship', 'the purpose of business, risk and reward, the role of the entrepreneur', 'enterprise'),
      T('bus-market', 'Marketing & the market', 'market research, the marketing mix (4Ps), segmentation and competition', 'enterprise'),
      T('bus-finance', 'Business finance', 'sources of finance, cash flow, revenue, costs, profit and break-even', 'operations'),
      T('bus-operations', 'Operations & production', 'production processes, quality, the supply chain and managing stock', 'operations'),
      T('bus-people', 'Human resources', 'organisational structures, recruitment, training and motivation', 'people'),
      T('bus-influences', 'External influences', 'the economy, interest rates, ethics, the environment and globalisation', 'people'),
    ],
  },

  {
    id: 'economics', name: 'Economics', icon: '💷', category: 'Social sciences',
    tiered: false, mode: 'exam', markingStyle: 'essay',
    paper: 'Microeconomics & macroeconomics',
    groups: { micro: { label: 'How markets work', color: '#1F8A4C' }, macro: { label: 'How the economy works', color: '#2F6DB5' } },
    topics: [
      T('econ-demand', 'Demand, supply & price', 'the market mechanism, shifts in demand and supply, and equilibrium price', 'micro'),
      T('econ-elasticity', 'Elasticity', 'price elasticity of demand and supply and why it matters to firms', 'micro'),
      T('econ-market-failure', 'Markets & market failure', 'competition, monopoly, externalities and government intervention', 'micro'),
      T('econ-objectives', 'Economic objectives', 'growth, low unemployment, low inflation and a stable balance of payments', 'macro'),
      T('econ-policy', 'Government policy', 'fiscal and monetary policy and how they affect the economy', 'macro'),
      T('econ-global', 'The global economy', 'international trade, exchange rates and globalisation', 'macro'),
    ],
  },

  {
    id: 'psychology', name: 'Psychology', icon: '🧠', category: 'Social sciences',
    tiered: false, mode: 'exam', markingStyle: 'essay',
    paper: 'Cognition & behaviour; social context',
    groups: { cognition: { label: 'Cognition & behaviour', color: '#8A4FB0' }, social: { label: 'Social context & behaviour', color: '#2F6DB5' }, research: { label: 'Research methods', color: '#E0A526' } },
    topics: [
      T('psy-memory', 'Memory', 'models of memory, types of long-term memory, and reasons for forgetting', 'cognition'),
      T('psy-perception', 'Perception', 'sensation vs perception, depth cues, and visual illusions', 'cognition'),
      T('psy-development', 'Development', 'early brain development, Piaget’s stages, and the effect of learning on the brain', 'cognition'),
      T('psy-social', 'Social influence', 'conformity, obedience, prosocial and antisocial behaviour, and crowd behaviour', 'social'),
      T('psy-language', 'Language, thought & communication', 'the relationship between language and thought, and non-verbal communication', 'social'),
      T('psy-research', 'Research methods', 'experiments, sampling, variables, ethics, and data and statistics', 'research'),
    ],
  },

  {
    id: 'sociology', name: 'Sociology', icon: '👥', category: 'Social sciences',
    tiered: false, mode: 'exam', markingStyle: 'essay',
    paper: 'The sociology of families, education & more',
    groups: { structures: { label: 'Social structures', color: '#1F8A4C' }, processes: { label: 'Social processes & issues', color: '#E8623A' }, methods: { label: 'Sociological methods', color: '#E0A526' } },
    topics: [
      T('soc-family', 'Families', 'family forms, changing roles, and sociological views of the family', 'structures'),
      T('soc-education', 'Education', 'the role of education, differential achievement, and processes within schools', 'structures'),
      T('soc-crime', 'Crime & deviance', 'social control, theories of crime, and patterns of offending', 'processes'),
      T('soc-stratification', 'Social stratification', 'social class, wealth and poverty, power and life chances', 'processes'),
      T('soc-methods', 'Research methods', 'primary and secondary methods, sampling, reliability, validity and ethics', 'methods'),
      T('soc-theory', 'Key concepts & theory', 'functionalism, Marxism, feminism, and socialisation and culture', 'methods'),
    ],
  },

  {
    id: 'statistics', name: 'Statistics', icon: '📊', category: 'STEM',
    tiered: true, mode: 'exam', markingStyle: 'maths',
    paper: 'Collecting, analysing & interpreting data',
    groups: { collect: { label: 'Collecting data', color: '#2F6DB5' }, analyse: { label: 'Processing & analysing', color: '#1F8A4C' }, probability: { label: 'Probability', color: '#8A4FB0' } },
    topics: [
      T('stat-sampling', 'The data-handling cycle & sampling', 'planning an investigation, populations and sampling methods including bias', 'collect'),
      T('stat-representation', 'Representing data', 'tables, bar charts, histograms, cumulative frequency and box plots', 'analyse'),
      T('stat-averages', 'Averages & spread', 'mean, median, mode, range, quartiles, IQR and standard deviation', 'analyse'),
      T('stat-correlation', 'Correlation & regression', 'scatter graphs, lines of best fit, correlation and making predictions', 'analyse'),
      T('stat-index', 'Index numbers & time series', 'index numbers, RPI, and moving averages for trends', 'analyse'),
      T('stat-probability', 'Probability', 'theoretical and experimental probability, tree diagrams and the binomial idea', 'probability'),
    ],
  },

  {
    id: 'pe', name: 'Physical Education', icon: '🏃', category: 'Other',
    tiered: false, mode: 'exam', markingStyle: 'essay',
    paper: 'Theory papers + practical assessment',
    groups: { anatomy: { label: 'Anatomy & physiology', color: '#E8623A' }, training: { label: 'Movement & training', color: '#1F8A4C' }, psych: { label: 'Sport psychology & society', color: '#2F6DB5' } },
    topics: [
      T('pe-skeletal', 'The skeletal & muscular systems', 'bones, joints, movement types, and the major muscles in action', 'anatomy'),
      T('pe-cardio', 'Cardiovascular & respiratory systems', 'the heart, blood vessels, gas exchange and the effects of exercise', 'anatomy'),
      T('pe-movement', 'Movement analysis', 'levers, planes and axes of movement', 'training'),
      T('pe-training', 'Physical training', 'components of fitness, principles of training, and methods of training', 'training'),
      T('pe-psychology', 'Sport psychology', 'skill classification, goal setting, mental preparation and feedback', 'psych'),
      T('pe-society', 'Health, fitness & society', 'diet and nutrition, the benefits of activity, and engagement in sport', 'psych'),
    ],
  },

  {
    id: 'media', name: 'Media Studies', icon: '🎬', category: 'Other',
    tiered: false, mode: 'exam', markingStyle: 'essay',
    paper: 'Media language, audiences & industries',
    groups: { language: { label: 'Media language & representation', color: '#8A4FB0' }, industry: { label: 'Industries & audiences', color: '#2F6DB5' } },
    topics: [
      T('media-language', 'Media language', 'how media products use codes and conventions to create meaning', 'language'),
      T('media-representation', 'Representation', 'how events, people and groups are represented, and the effect of choices', 'language'),
      T('media-industries', 'Media industries', 'ownership, regulation, and how products are produced and distributed', 'industry'),
      T('media-audiences', 'Audiences', 'how products target, reach and are interpreted by audiences', 'industry'),
    ],
  },

  {
    id: 'citizenship', name: 'Citizenship Studies', icon: '⚖️', category: 'Humanities',
    tiered: false, mode: 'exam', markingStyle: 'essay',
    paper: 'Life in modern Britain & rights',
    groups: { rights: { label: 'Rights & the law', color: '#2F6DB5' }, democracy: { label: 'Politics & democracy', color: '#E8623A' }, society: { label: 'Society & participation', color: '#1F8A4C' } },
    topics: [
      T('cit-rights', 'Rights & responsibilities', 'human and legal rights, the legal system and how laws are made', 'rights'),
      T('cit-democracy', 'Democracy & government', 'how the UK is governed, elections, parliament and devolution', 'democracy'),
      T('cit-society', 'Living together in the UK', 'identity, diversity, migration and mutual respect', 'society'),
      T('cit-action', 'Taking citizenship action', 'how citizens can bring about change and participate in democracy', 'society'),
    ],
  },

  // ---- Portfolio / practical subjects: revision checklist + tutor, no auto-marking ----
  {
    id: 'art', name: 'Art & Design', icon: '🎨', category: 'Creative', tiered: false,
    mode: 'portfolio', markingStyle: 'practical',
    paper: 'Portfolio (60%) + externally set task (40%)',
    checklist: [
      'Develop ideas: research artists and sources, and record your thinking in a sketchbook.',
      'Refine: experiment with media, techniques and processes, reviewing as you go.',
      'Record: observations and insights through drawings, photos and annotations.',
      'Present a personal, meaningful response that links clearly to your sources.',
      'Show the journey from first ideas through development to a final piece.',
      'Prepare for the externally set task: a sustained focus study and timed final piece.',
    ],
  },

  {
    id: 'drama', name: 'Drama', icon: '🎭', category: 'Creative', tiered: false,
    mode: 'portfolio', markingStyle: 'practical',
    paper: 'Devising + performance + written exam',
    checklist: [
      'Devising log: document your process from stimulus to performance.',
      'Apply theatrical skills: voice, movement, characterisation and use of space.',
      'Explore a practitioner or style and apply it to your work.',
      'Performance from a text: rehearse and refine a scripted extract.',
      'Written exam: revise the set text and how to analyse live theatre you have seen.',
      'Evaluate your own and others’ work using subject vocabulary.',
    ],
  },

  {
    id: 'music', name: 'Music', icon: '🎵', category: 'Creative', tiered: false,
    mode: 'portfolio', markingStyle: 'practical',
    paper: 'Performing + composing + listening exam',
    checklist: [
      'Performing: prepare a solo and an ensemble performance and record them.',
      'Composing: complete a free composition and one to a set brief.',
      'Listening exam: revise the set works and areas of study.',
      'Use the musical elements confidently: melody, harmony, rhythm, texture, timbre.',
      'Practise dictation and identifying features by ear.',
      'Know the key musical vocabulary for each area of study.',
    ],
  },

  {
    id: 'dt', name: 'Design & Technology', icon: '🛠️', category: 'Creative', tiered: false,
    mode: 'portfolio', markingStyle: 'practical',
    paper: 'NEA (50%) + written exam (50%)',
    checklist: [
      'Identify and investigate a design problem from a contextual challenge.',
      'Produce a design brief and specification informed by research.',
      'Generate, develop and communicate design ideas with sketches and models.',
      'Make a prototype, recording your manufacture and testing.',
      'Analyse and evaluate against your specification and user needs.',
      'Revise core theory: materials, energy, mechanisms and new technologies.',
    ],
  },

  {
    id: 'food', name: 'Food Preparation & Nutrition', icon: '🍳', category: 'Creative', tiered: false,
    mode: 'portfolio', markingStyle: 'practical',
    paper: 'Two NEA tasks + written exam',
    checklist: [
      'Food investigation (NEA1): research and experiment with the science of cooking.',
      'Food preparation assessment (NEA2): plan, prepare and cook three dishes in time.',
      'Demonstrate technical skills and good food hygiene and safety.',
      'Revise nutrition: macronutrients, micronutrients and dietary needs.',
      'Revise food science: why food behaves as it does when cooked.',
      'Revise food provenance, choice and where food comes from.',
    ],
  },
];

export const SUBJECTS_LIST = SUBJECTS;
export const SUBJECTS_BY_ID = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));

// Subject categories in display order.
export const CATEGORY_ORDER = [
  'Core', 'Sciences', 'Languages', 'Humanities', 'Social sciences', 'STEM', 'Creative', 'Other',
];

export function topicsByGroup(subject) {
  const grouped = {};
  for (const key of Object.keys(subject.groups || {})) grouped[key] = [];
  for (const t of subject.topics || []) {
    if (!grouped[t.group]) grouped[t.group] = [];
    grouped[t.group].push(t);
  }
  return grouped;
}
