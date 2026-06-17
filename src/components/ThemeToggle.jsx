import { useState } from 'react';

const KEY = 'gcsease:theme';

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem(KEY, next ? 'dark' : 'light'); } catch (e) { /* ignore */ }
  }
  return (
    <button
      onClick={toggle}
      title="Toggle dark mode"
      aria-label="Toggle dark mode"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface/60 text-ink transition hover:bg-surface"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
