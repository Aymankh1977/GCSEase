import { useEffect, useId, useState } from 'react';
import { speak, stopSpeaking, isSpeechSupported, subscribe, getCurrent, setCurrent } from '../lib/speech.js';

// Optional "Read aloud" button. Reads the given text using the browser's
// speech synthesis. Only one button plays at a time across the page.
export default function SpeakButton({ text, className = '' }) {
  const id = useId();
  const [speaking, setSpeaking] = useState(false);
  const supported = isSpeechSupported();

  useEffect(() => subscribe((cur) => setSpeaking(cur === id)), [id]);
  useEffect(() => () => { if (getCurrent() === id) stopSpeaking(); }, [id]);

  if (!supported || !text) return null;

  function toggle() {
    if (speaking) {
      stopSpeaking();
      setCurrent(null);
      return;
    }
    setCurrent(id);
    speak(text, { onend: () => { if (getCurrent() === id) setCurrent(null); } });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={speaking ? 'Stop reading' : 'Read aloud'}
      aria-label={speaking ? 'Stop reading' : 'Read aloud'}
      className={`inline-flex items-center gap-1 rounded-lg border border-line bg-surface/60 px-2 py-1 text-xs font-semibold text-slate2 transition hover:bg-surface hover:text-ink ${className}`}
    >
      {speaking ? '⏹ Stop' : '🔊 Read aloud'}
    </button>
  );
}
