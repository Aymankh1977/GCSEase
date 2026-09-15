import { useState } from 'react';

const STEPS = [
  {
    icon: '📚',
    title: 'Choose a subject',
    body: 'Pick any GCSE subject or KS3 Maths from the list below. For tiered subjects (Maths, Sciences) select Higher or Foundation first.',
  },
  {
    icon: '❓',
    title: 'Get a question',
    body: 'The AI generates a real exam-style question matched to your topic, grade target and exam board — a fresh question every time.',
  },
  {
    icon: '✍️',
    title: 'Write your answer',
    body: 'Type your working and answer in the box. For Maths, show your steps — the AI marks for method just like an examiner.',
  },
  {
    icon: '✅',
    title: 'Get marked instantly',
    body: 'Detailed feedback tells you exactly what marks you earned, what was missing, and how to improve — no waiting for a teacher.',
  },
  {
    icon: '📈',
    title: 'Track your progress',
    body: 'Your dashboard shows mastery for every topic. Green means secure; red means needs more practice. Progress is saved to your account.',
  },
];

const LS_KEY = 'gcsease:hiw-open';

function readOpen() {
  try { return localStorage.getItem(LS_KEY) !== 'false'; } catch { return true; }
}
function saveOpen(v) {
  try { localStorage.setItem(LS_KEY, v ? 'true' : 'false'); } catch { /* ignore */ }
}

export default function HowItWorks() {
  const [open, setOpen] = useState(readOpen);

  function toggle() {
    setOpen((v) => {
      saveOpen(!v);
      return !v;
    });
  }

  return (
    <section className="card overflow-hidden">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="font-display text-base font-semibold">How to use GCSEasy</span>
        <span
          className="text-slate2 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="border-t border-line px-5 pb-5 pt-4">
          <p className="mb-4 text-sm text-slate2">
            GCSEasy is an AI revision platform for GCSE and KS3 students. It generates
            real exam-style questions, marks your answers like an examiner, and tracks your
            progress topic by topic — available 24/7. Free accounts get 5 AI questions and
            5 tutor messages per day; upgrade to Pro for 30/day.
          </p>
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accentSoft text-base">
                  {s.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs text-slate2 leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-slate2">
            <strong>Tip:</strong> use the <em>Tutor</em> tab inside any subject to ask the AI
            questions in plain English — great for understanding tricky concepts before you practise.
          </p>
        </div>
      )}
    </section>
  );
}
