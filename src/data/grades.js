// GCSE grading (9-1) and the two entry tiers.
//
// GCSEs in England are graded 9 (highest) to 1 (lowest), with U = ungraded.
//   • Grade 9 is above the old A* and is awarded to the very top performers.
//   • Grade 4 is a "standard pass"; grade 5 is a "strong pass".
//   • Grade 1 is roughly the old grade G.
//
// Tiered subjects (Maths, the Sciences and the reformed MFLs) are sat at one of
// two tiers. Each tier only gives access to part of the grade range:
//   • FOUNDATION tier  → grades 1–5  (U if below 1)
//   • HIGHER tier      → grades 4–9  (a "safety net" allowed grade 3 just below 4; U below)

export const TIERS = {
  foundation: {
    id: 'foundation',
    label: 'Foundation tier',
    short: 'Foundation',
    grades: [1, 2, 3, 4, 5],
    color: '#1F8A4C',
    blurb:
      'Targets grades 1–5. Best if you are aiming for a secure pass (grade 4–5). You cannot be awarded above a 5 on this tier.',
  },
  higher: {
    id: 'higher',
    label: 'Higher tier',
    short: 'Higher',
    grades: [4, 5, 6, 7, 8, 9],
    color: '#E8623A',
    blurb:
      'Targets grades 4–9. Best if you are aiming for grade 6 and above. Papers are harder, but it is the only route to the top grades.',
  },
};

export const TIER_LIST = [TIERS.foundation, TIERS.higher];

// What each grade signals, and what a student typically needs to demonstrate
// to reach it. Kept board-neutral so it applies across all subjects.
export const GRADES = [
  {
    grade: 9,
    band: 'Exceptional',
    color: '#1F8A4C',
    headline: 'The very top — above the old A*.',
    needs: [
      'Near-flawless, fully accurate answers across the whole paper.',
      'Tackles the hardest problem-solving and "evaluate / to what extent" questions with insight.',
      'Reasoning is precise, well-structured and fully justified, with no gaps.',
      'Consistently picks up the final, most demanding marks others lose.',
    ],
  },
  {
    grade: 8,
    band: 'Excellent',
    color: '#2F6DB5',
    headline: 'Comfortably in the top band (old A*/A).',
    needs: [
      'Strong command of the hardest topics with very few slips.',
      'Confident multi-step problem solving and extended analysis.',
      'Clear, well-organised explanations using accurate technical vocabulary.',
      'Reliable accuracy under time pressure.',
    ],
  },
  {
    grade: 7,
    band: 'Strong',
    color: '#2F6DB5',
    headline: 'Roughly the old grade A.',
    needs: [
      'Secure across most of the specification, including higher-demand material.',
      'Answers extended-response questions with developed, relevant points.',
      'Applies methods to unfamiliar contexts, not just routine questions.',
      'Good exam technique: shows working and answers the command word.',
    ],
  },
  {
    grade: 6,
    band: 'Good (high)',
    color: '#E0A526',
    headline: 'A good pass, between the old B and C.',
    needs: [
      'Reliable on standard questions and many harder ones.',
      'Explains reasoning, not just final answers.',
      'Makes few careless errors and checks work where possible.',
      'Beginning to handle multi-step and applied problems independently.',
    ],
  },
  {
    grade: 5,
    band: 'Strong pass',
    color: '#E0A526',
    headline: 'A "strong pass" — the higher of the two pass grades.',
    needs: [
      'Solid grasp of core content with consistent accuracy.',
      'Answers most standard exam questions correctly.',
      'Can attempt and partly complete harder questions.',
      'Uses subject vocabulary and units correctly.',
    ],
  },
  {
    grade: 4,
    band: 'Standard pass',
    color: '#E8623A',
    headline: 'A "standard pass" — the grade most often needed to move on.',
    needs: [
      'Understands the key ideas and core methods of the subject.',
      'Answers routine questions correctly most of the time.',
      'Shows clear working so method marks are earned.',
      'Avoids leaving questions blank — always attempts something.',
    ],
  },
  {
    grade: 3,
    band: 'Developing',
    color: '#E8623A',
    headline: 'Just below a pass (old D).',
    needs: [
      'Recognises and recalls basic facts and methods.',
      'Completes simpler one- and two-step questions.',
      'Needs to build accuracy and confidence on core topics.',
      'Focus on the foundations to push towards a grade 4.',
    ],
  },
  {
    grade: 2,
    band: 'Foundational',
    color: '#465563',
    headline: 'Early progress (old E/F).',
    needs: [
      'Some recall of basic facts and the simplest techniques.',
      'Can answer the most straightforward questions with support.',
      'Build core knowledge topic by topic.',
    ],
  },
  {
    grade: 1,
    band: 'Entry',
    color: '#465563',
    headline: 'The lowest pass grade (old G).',
    needs: [
      'Beginning to recall a few key facts and ideas.',
      'Attempts the simplest questions.',
      'Best next step: secure the very basics with short, regular practice.',
    ],
  },
];

export const GRADES_BY_NUMBER = Object.fromEntries(GRADES.map((g) => [g.grade, g]));

// Map a difficulty band (1=build-up, 2=standard, 3=stretch) to a grade range
// label, taking the chosen tier into account. Used to steer the AI.
export function gradeBandForDifficulty(difficulty, tierId) {
  if (tierId === 'foundation') {
    return { 1: 'grade 1–2', 2: 'grade 3–4', 3: 'grade 5 (top of Foundation)' }[difficulty] || 'grade 3–4';
  }
  // higher (or untiered)
  return { 1: 'grade 4–5', 2: 'grade 6–7', 3: 'grade 8–9' }[difficulty] || 'grade 6–7';
}

export function gradesForTier(tierId) {
  const t = TIERS[tierId];
  const set = t ? new Set(t.grades) : null;
  return GRADES.filter((g) => (set ? set.has(g.grade) : true));
}
