import { SUBJECTS_LIST, PPE } from '../data/subjects.js';
import WelcomeFromDad from './WelcomeFromDad.jsx';

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = Math.ceil((new Date(dateStr + 'T09:00:00') - new Date()) / 86400000);
  return d;
}

export default function SubjectHome({ onPick }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-paper font-display text-xl">★</span>
          <div className="leading-tight">
            <h1 className="font-display text-lg font-semibold">Juri&apos;s Revision Hub</h1>
            <p className="text-xs text-slate2">{PPE.name} · {PPE.window}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 space-y-6">
        <WelcomeFromDad />

        <div>
          <h2 className="font-display text-xl">Choose a subject</h2>
          <p className="text-sm text-slate2">Pick a subject to practise exam questions, get a tutor, and track your progress.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SUBJECTS_LIST.map((s, i) => {
            const days = daysUntil(s.examDate);
            return (
              <button
                key={s.id}
                onClick={() => onPick(s.id)}
                className="card rise group p-4 text-left transition hover:shadow-lift hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accentSoft text-2xl">{s.icon}</span>
                  {days != null && days >= 0 && (
                    <span className="rounded-full bg-coral/10 px-2 py-0.5 text-xs font-semibold text-coral">
                      {days === 0 ? 'today' : `${days}d`}
                    </span>
                  )}
                  {s.mode === 'portfolio' && (
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">portfolio</span>
                  )}
                </div>
                <p className="mt-3 font-display text-lg leading-tight">
                  {s.name}{s.tier ? <span className="text-slate2 text-base"> · {s.tier}</span> : null}
                </p>
                <p className="mt-0.5 text-xs text-slate2">{s.board}</p>
                <p className="mt-2 text-xs text-slate2">{s.examLabel}</p>
              </button>
            );
          })}
        </div>

        <p className="px-1 pt-2 text-center text-xs text-slate2">
          Made with love by Dad · revise a little every day, and be kind to yourself 🌹
        </p>
      </main>
    </div>
  );
}
