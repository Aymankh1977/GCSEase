import { useEffect, useState } from 'react';

// A loving welcome for Juri, from her Dad. A different message shows each visit,
// cycling through the list so it stays fresh and encouraging.
const MESSAGES = [
  'you look amazing today',
  'you are so clever and capable',
  'your hard work is truly shining through',
  'you make me so proud, every single day',
  'you can do anything you set your mind to',
  'your kindness lights up every room',
  'you are braver and stronger than you know',
  'believe in yourself the way I believe in you',
  'every question you try makes you a little brilliant-er',
  'you are my greatest joy',
];

const KEY = 'gcse-math-revise:welcome-index';

export default function WelcomeFromDad() {
  const [msg, setMsg] = useState(MESSAGES[0]);

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
    <section className="welcome-juri rise relative overflow-hidden rounded-2xl border border-coral/30 p-6 sm:p-7">
      {/* floating hearts */}
      <span className="float-heart" style={{ left: '8%', animationDelay: '0s' }}>🌹</span>
      <span className="float-heart" style={{ left: '24%', animationDelay: '1.6s' }}>💕</span>
      <span className="float-heart" style={{ left: '52%', animationDelay: '0.8s' }}>❤️</span>
      <span className="float-heart" style={{ left: '74%', animationDelay: '2.2s' }}>🌹</span>
      <span className="float-heart" style={{ left: '90%', animationDelay: '1.1s' }}>💖</span>

      <div className="relative">
        <p className="font-display text-2xl sm:text-3xl text-ink">
          Hello Juri, <span className="italic text-coral">{msg}</span> 🌹
        </p>
        <p className="mt-3 font-display text-lg italic text-slate2">
          With all my love and every bit of pride in the world,
        </p>
        <p className="mt-1 font-display text-xl text-ink">
          Your loving Dad — Ayman <span className="whitespace-nowrap">❤️🌹</span>
        </p>
      </div>

      <style>{`
        .welcome-juri {
          background:
            radial-gradient(120% 140% at 0% 0%, rgba(232, 98, 58, 0.16), transparent 55%),
            radial-gradient(120% 140% at 100% 100%, rgba(224, 165, 38, 0.18), transparent 55%),
            linear-gradient(135deg, #fff4ef 0%, #fdeede 100%);
        }
        .float-heart {
          position: absolute;
          bottom: -1.5rem;
          font-size: 1.1rem;
          opacity: 0;
          animation: floatUp 6s ease-in infinite;
          pointer-events: none;
          user-select: none;
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(0.8); opacity: 0; }
          15%  { opacity: 0.9; }
          80%  { opacity: 0.7; }
          100% { transform: translateY(-220px) scale(1.1) rotate(12deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .float-heart { animation: none; opacity: 0.6; bottom: auto; top: 0.75rem; }
        }
      `}</style>
    </section>
  );
}
