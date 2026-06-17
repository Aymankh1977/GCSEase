import { useEffect, useState } from 'react';

// A warm, encouraging welcome addressed to the logged-in student by name.
// A different message shows each visit, cycling through the list.
const MESSAGES = [
  'every question you try makes you a little sharper',
  'you are more capable than you realise',
  'small steps every day add up to big results',
  'progress, not perfection — keep going',
  'your hard work is going to pay off',
  'believe in yourself; you have got this',
  'mistakes are just practice in disguise',
  'consistency beats cramming — well done for showing up',
  'you are building skills that will last a lifetime',
  'focus on today, and the grades will follow',
];

const KEY = 'gcsease:welcome-index';

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function WelcomeBanner({ name }) {
  const [msg, setMsg] = useState(MESSAGES[0]);
  const first = (name || 'there').trim().split(/\s+/)[0];

  useEffect(() => {
    let idx;
    try {
      const prev = parseInt(localStorage.getItem(KEY) ?? '-1', 10);
      idx = (Number.isNaN(prev) ? -1 : prev) + 1;
      if (idx >= MESSAGES.length) idx = 0;
      localStorage.setItem(KEY, String(idx));
    } catch {
      idx = Math.floor(Math.random() * MESSAGES.length);
    }
    setMsg(MESSAGES[idx]);
  }, []);

  return (
    <section className="welcome-banner rise relative overflow-hidden rounded-2xl border border-accent/30 p-6 sm:p-7">
      <span className="float-spark" style={{ left: '10%', animationDelay: '0s' }}>✦</span>
      <span className="float-spark" style={{ left: '32%', animationDelay: '1.6s' }}>✧</span>
      <span className="float-spark" style={{ left: '58%', animationDelay: '0.8s' }}>✦</span>
      <span className="float-spark" style={{ left: '80%', animationDelay: '2.2s' }}>✧</span>

      <div className="relative">
        <p className="font-display text-2xl sm:text-3xl text-ink">
          {timeGreeting()}, {first} 👋
        </p>
        <p className="mt-2 font-display text-lg sm:text-xl italic text-accent">
          {msg}.
        </p>
        <p className="mt-3 text-sm text-slate2">
          Pick up where you left off, or choose a subject below to start revising.
        </p>
      </div>

      <style>{`
        .welcome-banner {
          background:
            radial-gradient(120% 140% at 0% 0%, rgba(31, 138, 76, 0.14), transparent 55%),
            radial-gradient(120% 140% at 100% 100%, rgba(47, 109, 181, 0.16), transparent 55%),
            linear-gradient(135deg, rgba(226,240,229,0.7) 0%, rgba(230,238,247,0.6) 100%);
        }
        .float-spark {
          position: absolute;
          bottom: -1.5rem;
          font-size: 1rem;
          color: rgb(var(--c-accent));
          opacity: 0;
          animation: floatUp 6s ease-in infinite;
          pointer-events: none;
          user-select: none;
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(0.8); opacity: 0; }
          15%  { opacity: 0.9; }
          80%  { opacity: 0.6; }
          100% { transform: translateY(-200px) scale(1.1) rotate(12deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .float-spark { animation: none; opacity: 0.5; bottom: auto; top: 0.75rem; }
        }
      `}</style>
    </section>
  );
}
