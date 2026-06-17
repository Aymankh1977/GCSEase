import { SUBJECTS_LIST, CATEGORY_ORDER } from '../data/subjects.js';
import { BOARDS, BOARDS_BY_ID } from '../data/boards.js';
import { TIER_LIST, TIERS } from '../data/grades.js';
import WelcomeBanner from './WelcomeBanner.jsx';

export default function Home({ user, boardId, tierId, onBoard, onTier, onPick, onGrades }) {
  const byCategory = CATEGORY_ORDER
    .map((cat) => ({ cat, subjects: SUBJECTS_LIST.filter((s) => s.category === cat) }))
    .filter((g) => g.subjects.length);

  return (
    <div className="space-y-8">
      <WelcomeBanner name={user?.name} />

      {/* Exam board — one click to switch */}
      <section>
        <h2 className="mb-1 font-display text-xl">Exam board</h2>
        <p className="mb-3 text-sm text-slate2">Tap your board — questions and marking are tailored to its specification.</p>
        <div className="flex flex-wrap gap-2">
          {BOARDS.map((b) => {
            const active = b.id === boardId;
            return (
              <button
                key={b.id}
                onClick={() => onBoard(b.id)}
                className={`rounded-xl border px-4 py-2.5 text-left transition ${active ? 'border-transparent text-white shadow-card' : 'border-line bg-surface/70 hover:bg-surface'}`}
                style={active ? { background: b.color } : undefined}
              >
                <span className="block text-sm font-semibold">{b.name}</span>
                <span className={`block text-xs ${active ? 'text-white/80' : 'text-slate2'}`}>{b.region}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tier + grade guide — one click each */}
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <h3 className="font-display text-lg">Tier</h3>
          <p className="mb-2 text-xs text-slate2">Applies to tiered subjects (Maths, Sciences, languages).</p>
          <div className="flex gap-1 rounded-xl border border-line bg-surface p-1">
            {TIER_LIST.map((t) => (
              <button
                key={t.id}
                onClick={() => onTier(t.id)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${tierId === t.id ? 'text-white' : 'text-slate2 hover:text-ink'}`}
                style={tierId === t.id ? { background: t.color } : undefined}
              >
                {t.short}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate2">
            Grades {TIERS[tierId]?.grades[0]}–{TIERS[tierId]?.grades.slice(-1)[0]} available on this tier.
          </p>
        </div>

        <button onClick={onGrades} className="card group p-4 text-left transition hover:shadow-lift hover:-translate-y-0.5">
          <h3 className="font-display text-lg">Grade guide (1–9)</h3>
          <p className="mb-3 text-xs text-slate2">See exactly what each grade needs on your tier.</p>
          <div className="flex gap-1.5">
            {TIERS[tierId]?.grades.map((n) => (
              <span key={n} className="grid h-7 w-7 place-items-center rounded-md bg-ink text-xs font-bold text-paper">{n}</span>
            ))}
          </div>
          <span className="mt-3 inline-block text-sm font-semibold text-accent group-hover:underline">Open grade guide →</span>
        </button>
      </section>

      {/* Subjects */}
      <section>
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2 className="font-display text-xl">Subjects</h2>
          <span className="text-xs text-slate2">{BOARDS_BY_ID[boardId]?.name} · {TIERS[tierId]?.short}</span>
        </div>

        <div className="space-y-6">
          {byCategory.map(({ cat, subjects }) => (
            <div key={cat}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate2">{cat}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => onPick(s.id)}
                    className="card rise group p-4 text-left transition hover:shadow-lift hover:-translate-y-0.5"
                    style={{ animationDelay: `${i * 25}ms` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-accentSoft text-2xl">{s.icon}</span>
                      <div className="flex flex-col items-end gap-1">
                        {s.tiered && (
                          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate2">
                            {TIERS[tierId]?.short}
                          </span>
                        )}
                        {s.mode === 'portfolio' && (
                          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">portfolio</span>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 font-display text-lg leading-tight">{s.name}</p>
                    <p className="mt-1 text-xs text-slate2">{s.paper}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
