import { useState } from 'react';
import { gradesForTier, TIERS } from '../data/grades.js';

// One-click grade guide: shows grades 1–9 (filtered to the chosen tier) and
// what each grade typically needs. Tap a grade to expand its checklist.
export default function GradeGuide({ tierId, subjectName }) {
  const tier = TIERS[tierId];
  const grades = gradesForTier(tierId);
  const [open, setOpen] = useState(grades[0]?.grade ?? null);

  return (
    <div className="space-y-5">
      <section className="card rise overflow-hidden">
        <div className="bg-ink px-5 py-4 text-paper">
          <p className="font-display text-xl">Grades 1–9: what each one needs</p>
          <p className="text-sm opacity-80">
            {subjectName ? `${subjectName} · ` : ''}{tier ? `${tier.label} — covers grades ${tier.grades[0]}–${tier.grades[tier.grades.length - 1]}` : 'All grades'}
          </p>
        </div>
        {tier && <p className="p-4 text-sm text-slate2">{tier.blurb}</p>}
      </section>

      <div className="grid gap-3">
        {grades.map((g) => {
          const isOpen = open === g.grade;
          return (
            <div key={g.grade} className="card overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : g.grade)}
                className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-surface"
              >
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-display text-2xl font-bold text-white"
                  style={{ background: g.color }}
                >
                  {g.grade}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg leading-tight">{g.band}</span>
                  <span className="block truncate text-sm text-slate2">{g.headline}</span>
                </span>
                <span className={`shrink-0 text-slate2 transition ${isOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {isOpen && (
                <div className="border-t border-line px-4 py-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate2">
                    To reach grade {g.grade}{subjectName ? ` in ${subjectName}` : ''}, aim to:
                  </p>
                  <ul className="space-y-1.5">
                    {g.needs.map((n, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="mt-0.5 shrink-0 text-accent">✓</span>
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
