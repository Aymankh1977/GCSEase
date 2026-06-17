import { useMemo, useState } from 'react';
import { getSubjectProgress, getSubjectStats, masteryBand, resetSubject } from '../lib/storage.js';
import { TIERS, GRADES_BY_NUMBER } from '../data/grades.js';
import { estimateLevel, levelUpSteps, tierRange } from '../lib/level.js';

const TONE = { good: 'text-accent', mid: 'text-gold', weak: 'text-coral', idle: 'text-slate2' };
const CONF = { high: 'High confidence', medium: 'Building a picture', low: 'Early estimate' };

function StatCard({ label, value, sub }) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase tracking-wide text-slate2">{label}</p>
      <p className="mt-1 font-display text-3xl tabular">{value}</p>
      {sub && <p className="text-xs text-slate2">{sub}</p>}
    </div>
  );
}

export default function Dashboard({ subject, tierId, onPractice, onGrades }) {
  const [progress, setProgress] = useState(() => getSubjectProgress(subject.id));
  const topicsById = useMemo(
    () => Object.fromEntries(subject.topics.map((t) => [t.id, t])),
    [subject]
  );

  const stats = useMemo(() => {
    const entries = Object.entries(progress);
    const attempted = entries.length;
    const totalAttempts = entries.reduce((a, [, p]) => a + (p.attempts || 0), 0);
    const masteries = entries.map(([, p]) => p.mastery).filter((m) => m != null);
    const avg = masteries.length ? Math.round((masteries.reduce((a, b) => a + b, 0) / masteries.length) * 100) : 0;
    return { attempted, totalAttempts, avg };
  }, [progress]);

  const weakAreas = useMemo(() => {
    return Object.entries(progress)
      .filter(([, p]) => p.mastery != null)
      .sort((a, b) => a[1].mastery - b[1].mastery)
      .slice(0, 5)
      .map(([id, p]) => ({ topic: topicsById[id], p }))
      .filter((x) => x.topic);
  }, [progress, topicsById]);

  const tier = subject.tiered ? TIERS[tierId] : null;
  const gradeRange = tier ? `${tier.grades[0]}–${tier.grades.slice(-1)[0]}` : '1–9';

  const effTier = subject.tiered ? tierId : 'all';
  const subjStats = useMemo(() => getSubjectStats(subject.id), [progress, subject.id]);
  const level = useMemo(() => estimateLevel(subjStats, subject.topics.length, effTier), [subjStats, subject.topics.length, effTier]);
  const weakNames = weakAreas.map((w) => w.topic.name);
  const steps = useMemo(() => levelUpSteps(level, subjStats, weakNames), [level, subjStats, weakNames.join('|')]);
  const [rlo, rhi] = tierRange(effTier);
  const pct = level.known ? Math.round(((level.exact - rlo) / (rhi - rlo)) * 100) : 0;
  const gradeColor = level.known ? GRADES_BY_NUMBER[level.grade]?.color : '#465563';

  return (
    <div className="space-y-6">
      <section className="card rise overflow-hidden">
        <div className="bg-ink px-5 py-4 text-paper">
          <p className="font-display text-xl">{subject.name}{subject.tier ? ` · ${subject.tier}` : ''}</p>
          <p className="text-sm opacity-80">{subject.board} · {subject.paper}</p>
        </div>
        <div className="grid grid-cols-3 gap-px bg-line">
          <div className="bg-surface/85 p-4">
            <p className="text-xs uppercase tracking-wide text-slate2">Exam board</p>
            <p className="font-semibold">{subject.board}</p>
          </div>
          <div className="bg-surface/85 p-4">
            <p className="text-xs uppercase tracking-wide text-slate2">Tier</p>
            <p className="font-semibold">{subject.tier || 'Untiered'}</p>
          </div>
          <button onClick={onGrades} className="bg-surface/85 p-4 text-left transition hover:bg-surface">
            <p className="text-xs uppercase tracking-wide text-slate2">Grades available</p>
            <p className="font-display text-2xl tabular text-accent">{gradeRange}</p>
            <p className="text-xs text-slate2">View grade guide →</p>
          </button>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <StatCard label="Topics started" value={`${stats.attempted}/${subject.topics.length}`} />
        <StatCard label="Questions done" value={stats.totalAttempts} />
        <StatCard label="Avg. mastery" value={`${stats.avg}%`} sub="across started topics" />
      </section>

      {/* Working-grade estimate + how to level up */}
      <section className="card rise p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl font-display text-3xl font-bold text-white"
            style={{ background: gradeColor }}
          >
            {level.known ? level.grade : '–'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg leading-tight">
              {level.known ? `You're working around grade ${level.grade}` : 'Your working grade'}
            </h2>
            <p className="text-sm text-slate2">
              {level.known
                ? (level.nextGrade ? `Next up: grade ${level.nextGrade}` : 'Top of your tier — keep it up!') + ` · ${CONF[level.confidence]}`
                : 'Answer a few questions and we’ll estimate the grade you’re working at.'}
            </p>
          </div>
        </div>

        {level.known && (
          <div className="mt-4">
            <div className="relative h-2.5 w-full rounded-full bg-line">
              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: gradeColor }} />
            </div>
            <div className="mt-1 flex justify-between text-xs text-slate2">
              <span>Grade {rlo}</span>
              <span>Grade {rhi}</span>
            </div>
          </div>
        )}

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate2">
            {level.known && level.nextGrade ? `To reach grade ${level.nextGrade}` : 'Your next steps'}
          </p>
          <ul className="space-y-1.5">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="mt-0.5 shrink-0 text-accent">→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <button className="btn-accent mt-4" onClick={() => onPractice(weakAreas[0]?.topic?.id || null)}>
          {level.known ? 'Practise to level up' : 'Start practising'}
        </button>
      </section>

      <section className="card rise p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg">Focus on these next</h2>
          {stats.attempted > 0 && (
            <button
              className="text-xs text-slate2 underline hover:text-coral"
              onClick={() => {
                if (confirm(`Reset your ${subject.name} progress? This cannot be undone.`)) {
                  resetSubject(subject.id);
                  setProgress({});
                }
              }}
            >
              Reset {subject.name}
            </button>
          )}
        </div>

        {weakAreas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line p-6 text-center text-slate2">
            <p>No data yet — answer a few questions and your weakest topics will appear here.</p>
            <button className="btn-accent mt-3" onClick={() => onPractice(null)}>Start practising</button>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {weakAreas.map(({ topic, p }) => {
              const band = masteryBand(p.mastery);
              return (
                <li key={topic.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{topic.name}</p>
                    <p className="text-xs text-slate2">
                      {p.correct}/{p.attempts} correct · <span className={TONE[band.tone]}>{band.label}</span>
                    </p>
                  </div>
                  <button className="btn-ghost shrink-0" onClick={() => onPractice(topic.id)}>Practise</button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
