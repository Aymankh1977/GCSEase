import { useState } from 'react';
import { getChecklist, toggleChecklist } from '../lib/storage.js';

export default function Checklist({ subject }) {
  const [done, setDone] = useState(() => getChecklist(subject.id));
  const items = subject.checklist || [];
  const count = items.filter((_, i) => done[i]).length;

  return (
    <div className="space-y-5">
      <section className="card rise overflow-hidden">
        <div className="bg-ink px-5 py-4 text-paper">
          <p className="font-display text-xl">{subject.name}</p>
          <p className="text-sm opacity-80">{subject.board} · {subject.paper}</p>
        </div>
        <div className="p-4 text-sm text-slate2">
          This is a portfolio / practical subject, so there&apos;s no exam-question practice — instead, here&apos;s a
          checklist for your final piece. Use the <span className="font-semibold text-ink">Tutor</span> tab for ideas,
          feedback on your plans, or help analysing your chosen artist or photographer.
        </div>
      </section>

      <section className="card rise p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg">Final-piece checklist</h2>
          <span className="text-sm font-semibold text-slate2 tabular">{count}/{items.length} done</span>
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i}>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white/70 p-3 hover:bg-white">
                <input
                  type="checkbox"
                  checked={!!done[i]}
                  onChange={(e) => setDone(toggleChecklist(subject.id, i, e.target.checked))}
                  className="mt-1 h-5 w-5 shrink-0 accent-accent"
                />
                <span className={done[i] ? 'text-slate2 line-through' : ''}>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
