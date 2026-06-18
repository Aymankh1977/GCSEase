// Read text aloud using the browser's built-in speech synthesis (no API cost,
// works offline). We also tidy markdown/LaTeX so it reads naturally rather than
// saying "dollar", "backslash frac", etc.

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function cleanForSpeech(raw) {
  let s = String(raw || '');
  // code blocks / inline code
  s = s.replace(/```[\s\S]*?```/g, ' (code) ').replace(/`([^`]*)`/g, '$1');
  // math delimiters: keep the inner content, drop the $ signs
  s = s.replace(/\$\$([\s\S]*?)\$\$/g, ' $1 ').replace(/\$([^$]*)\$/g, ' $1 ');
  // common LaTeX -> spoken words
  const map = [
    [/\\times/g, ' times '],
    [/\\div/g, ' divided by '],
    [/\\cdot/g, ' times '],
    [/\\pm/g, ' plus or minus '],
    [/\\leq/g, ' less than or equal to '],
    [/\\geq/g, ' greater than or equal to '],
    [/\\neq/g, ' not equal to '],
    [/\\approx/g, ' approximately '],
    [/\\rightarrow/g, ' gives '],
    [/\\to/g, ' gives '],
    [/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, ' $1 over $2 '],
    [/\\sqrt\s*\{([^{}]*)\}/g, ' square root of $1 '],
    [/\\pi/g, ' pi '],
    [/\\degree|\\circ/g, ' degrees '],
    [/\^\{?2\}?/g, ' squared '],
    [/\^\{?3\}?/g, ' cubed '],
    [/\^\{?([0-9a-zA-Z]+)\}?/g, ' to the power $1 '],
    [/_\{?([0-9a-zA-Z]+)\}?/g, ' $1 '],
    [/\\[a-zA-Z]+/g, ' '], // drop any remaining LaTeX commands
  ];
  for (const [re, rep] of map) s = s.replace(re, rep);
  // markdown emphasis / headers / quotes; turn bullets into pauses
  s = s.replace(/^\s*[-•]\s+/gm, ', ');
  s = s.replace(/[*_#>|]/g, ' ');
  s = s.replace(/[{}]/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

let _cachedVoice = null;
if (isSpeechSupported()) {
  // voices load asynchronously in some browsers
  window.speechSynthesis.onvoiceschanged = () => { _cachedVoice = null; };
}
function scoreVoice(v) {
  // Prefer high-quality natural/neural/enhanced voices over robotic TTS
  let score = 0;
  const name = v.name.toLowerCase();
  if (/neural|natural|enhanced|premium|wavenet|studio/i.test(name)) score += 40;
  if (/google/i.test(name)) score += 20;
  if (/microsoft/i.test(name) && !/zira|david|mark/i.test(name)) score += 15;
  // Prefer Samantha / Karen / Daniel (good OS built-in voices)
  if (/samantha|karen|daniel|rishi|serena|oliver/i.test(name)) score += 25;
  // British English first, then any English
  if (/en[-_]GB/i.test(v.lang)) score += 10;
  else if (/^en/i.test(v.lang)) score += 5;
  return score;
}

function pickVoice() {
  if (_cachedVoice) return _cachedVoice;
  const voices = (isSpeechSupported() && window.speechSynthesis.getVoices()) || [];
  const english = voices.filter((v) => /^en/i.test(v.lang));
  const pool = english.length ? english : voices;
  _cachedVoice = pool.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;
  return _cachedVoice;
}

export function speak(text, { onend } = {}) {
  if (!isSpeechSupported()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(cleanForSpeech(text));
  const v = pickVoice();
  if (v) u.voice = v;
  u.lang = (v && v.lang) || 'en-GB';
  u.rate = 0.95;
  u.pitch = 1.05;
  if (onend) { u.onend = onend; u.onerror = onend; }
  synth.speak(u);
  return true;
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

// ---- Speech recognition (mic input) ----
const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
export function isMicSupported() { return !!SR; }

export function startListening({ onResult, onEnd, onError } = {}) {
  if (!SR) return null;
  const rec = new SR();
  rec.lang = 'en-GB';
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => { const t = e.results[0]?.[0]?.transcript || ''; if (t) onResult?.(t); };
  rec.onend = () => onEnd?.();
  rec.onerror = (e) => onError?.(e.error);
  rec.start();
  return rec;
}

// Tiny pub/sub so only one "Read aloud" button is active at a time.
const _listeners = new Set();
let _current = null;
export function setCurrent(id) { _current = id; _listeners.forEach((l) => l(id)); }
export function getCurrent() { return _current; }
export function subscribe(l) { _listeners.add(l); return () => _listeners.delete(l); }
