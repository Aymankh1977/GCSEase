import { useState } from 'react';
import { topicsByStrand, STRANDS } from '../data/topics.js';
import { getProgress, masteryBand } from '../lib/storage.js';

const TONE_BG = {
  good: 'bg-accentSoft text-accent',
  mid: 'bg-gold/15 text-gold',
  weak: 'bg-coral/15 text-coral',
  idle: 'bg-line/40 text-slate2',
};

export default function TopicBrowser({ onPractice }) {
  const grouped = topicsByStrand();
  const [open, setOpen] = useState(null); // topic id whose Sparx codes are shown

  return (
    <div className="space-y-6">
      <div className="card rise p-5">
        <h2 className="font-display text-lg">Every Higher topic in this PPE</h2>
        <p className="text-sm text-slate2">
          Tap a topic to practise it, or reveal its Sparx codes to search in the Independent Learning
          area on Sparx.
        </p>
      </div>

      {Object.entries(grouped).map(([key, topics]) =>
        topics.length === 0 ? null : (
          <section key={key} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="h-3 w-3 rounded-full" style={{ background: STRANDS[key].color }} />
              <h3 className="font-display text-base">{STRANDS[key].label}</h3>
              <span className="text-xs text-slate2">({topics.length})</span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {topics.map((t) => {
                const p = getProgress(t.id);
                const band = masteryBand(p.mastery);
                const isOpen = open === t.id;
                return (
                  <div key={t.id} className="card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold">{t.name}</p>
                        <p className="mt-0.5 text-xs text-slate2">{t.focus}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${TONE_BG[band.tone]}`}
                      >
                        {band.label}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button className="btn-accent !py-1.5 !px-3 text-sm" onClick={() => onPractice(t.id)}>
                        Practise
                      </button>
                      <button
                        className="btn-ghost !py-1.5 !px-3 text-sm"
                        onClick={() => setOpen(isOpen ? null : t.id)}
                      >
                        {isOpen ? 'Hide' : `Sparx codes (${t.sparx.length})`}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {t.sparx.map((code) => (
                          <span key={code} className="chip">{code}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )
      )}
    </div>
  );
}
