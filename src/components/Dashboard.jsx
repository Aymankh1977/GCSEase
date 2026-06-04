import { useMemo, useState } from 'react';
import { getSubjectProgress, masteryBand, resetSubject } from '../lib/storage.js';

const TONE = { good: 'text-accent', mid: 'text-gold', weak: 'text-coral', idle: 'text-slate2' };

function StatCard({ label, value, sub }) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase tracking-wide text-slate2">{label}</p>
      <p className="mt-1 font-display text-3xl tabular">{value}</p>
      {sub && <p className="text-xs text-slate2">{sub}</p>}
    </div>
  );
}

export default function Dashboard({ subject, onPractice }) {
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

  const days = useMemo(() => {
    if (!subject.examDate) return null;
    return Math.ceil((new Date(subject.examDate + 'T09:00:00') - new Date()) / 86400000);
  }, [subject]);

  return (
    <div className="space-y-6">
      <section className="card rise overflow-hidden">
        <div className="bg-ink px-5 py-4 text-paper">
          <p className="font-display text-xl">{subject.name}{subject.tier ? ` · ${subject.tier}` : ''}</p>
          <p className="text-sm opacity-80">{subject.board} · {subject.paper}</p>
        </div>
        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
          <div className="bg-surface/85 p-4">
            <p className="text-xs uppercase tracking-wide text-slate2">Exam</p>
            <p className="font-semibold">{subject.examLabel}</p>
          </div>
          <div className="bg-surface/85 p-4">
            <p className="text-xs uppercase tracking-wide text-slate2">Days to go</p>
            <p className="font-display text-2xl tabular text-coral">{days != null && days >= 0 ? days : '—'}</p>
          </div>
          <div className="bg-surface/85 p-4">
            <p className="text-xs uppercase tracking-wide text-slate2">Lead teacher</p>
            <p className="font-semibold">{subject.leadTeacher || '—'}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <StatCard label="Topics started" value={`${stats.attempted}/${subject.topics.length}`} />
        <StatCard label="Questions done" value={stats.totalAttempts} />
        <StatCard label="Avg. mastery" value={`${stats.avg}%`} sub="across started topics" />
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
