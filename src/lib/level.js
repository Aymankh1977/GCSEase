// Estimate the student's current "working grade" from their practice history,
// and turn it into concrete level-up steps. The estimate is a transparent
// heuristic (not a real exam predictor): it looks at how well the student is
// doing at each difficulty band, how much of the subject they've covered, and
// rewards success on harder questions.

import { TIERS } from '../data/grades.js';

// Grade range and the grade band each difficulty (1=build-up,2=standard,3=stretch)
// represents, per tier. 'all' is used for untiered subjects (full 1–9 range).
const RANGE = { foundation: [1, 5], higher: [4, 9], all: [1, 9] };
const REP = {
  foundation: { 1: [1, 2], 2: [3, 4], 3: [4, 5] },
  higher:     { 1: [4, 5], 2: [6, 7], 3: [8, 9] },
  all:        { 1: [3, 4], 2: [5, 6], 3: [7, 9] },
};

function tierKey(tierId) {
  return tierId in RANGE ? tierId : 'all';
}

export function tierRange(tierId) {
  return RANGE[tierKey(tierId)];
}

// stats: from storage.getSubjectStats(); totalTopics: subject.topics.length
export function estimateLevel(stats, totalTopics, tierId) {
  const key = tierKey(tierId);
  const [lo, hi] = RANGE[key];

  if (!stats || stats.totalAttempts < 3) {
    return { known: false, lo, hi, attempts: stats?.totalAttempts || 0 };
  }

  let weighted = 0;
  let weight = 0;
  for (const d of [1, 2, 3]) {
    const b = stats.byDiff[d];
    if (!b || !b.a) continue;
    const rate = b.rate ?? (b.s / b.a); // success rate at this band (0–1)
    const [g0, g1] = REP[key][d];
    const demonstrated = g0 + (g1 - g0) * rate; // acing a band → top of its grade range
    const w = b.a * (1 + 0.25 * (d - 1)); // harder bands count a little more
    weighted += demonstrated * w;
    weight += w;
  }
  let exact = weight ? weighted / weight : lo;

  // coverage: trying only a couple of topics shouldn't crown you yet
  const coverage = totalTopics ? stats.attempted / totalTopics : 0;
  if (coverage < 0.5) exact -= (0.5 - coverage); // up to −0.5 of a grade

  exact = Math.max(lo, Math.min(hi, exact));
  const grade = Math.max(lo, Math.min(hi, Math.round(exact)));
  const nextGrade = grade < hi ? grade + 1 : null;

  const confidence = stats.totalAttempts >= 20 && coverage >= 0.5
    ? 'high'
    : stats.totalAttempts >= 8 ? 'medium' : 'low';

  return { known: true, exact, grade, nextGrade, lo, hi, coverage, confidence, byDiff: stats.byDiff };
}

const BAND = { 1: 'Build-up', 2: 'Standard', 3: 'Stretch' };

// Concrete, encouraging next steps. weakTopicNames: array of strings.
export function levelUpSteps(level, stats, weakTopicNames = []) {
  if (!level.known) {
    return ['Answer questions across a few topics so we can gauge your working grade.'];
  }
  const steps = [];

  if (weakTopicNames.length) {
    steps.push(`Shore up your weakest topics first: ${weakTopicNames.slice(0, 3).join(', ')}.`);
  }

  // find the hardest band they're already handling well, and nudge to the next
  let topSolid = 0;
  for (const d of [1, 2, 3]) {
    const b = stats?.byDiff?.[d];
    const rate = b && b.a ? (b.rate ?? b.s / b.a) : null;
    if (rate != null && rate >= 0.7 && b.a >= 2) topSolid = d;
  }
  if (topSolid && topSolid < 3) {
    steps.push(`You're handling ${BAND[topSolid]} questions well — start mixing in ${BAND[topSolid + 1]} ones.`);
  } else if (topSolid === 3) {
    steps.push('Keep pushing on Stretch questions and aim for full marks each time.');
  } else {
    steps.push('Build confidence on Standard questions, showing your full working.');
  }

  if (level.coverage != null && level.coverage < 0.6) {
    steps.push(`Practise more topics — you've tried about ${Math.round(level.coverage * 100)}% of this subject so far.`);
  }
  if (level.nextGrade) {
    steps.push(`Earning consistent full marks is what moves you from grade ${level.grade} to ${level.nextGrade}.`);
  }
  return steps.slice(0, 4);
}

// One-line summary for the AI (practice + tutor) so it knows where the student is.
export function levelSummary(level) {
  if (!level || !level.known) return '';
  return `working around grade ${level.grade}${level.nextGrade ? `, aiming for grade ${level.nextGrade}` : ''}`;
}
