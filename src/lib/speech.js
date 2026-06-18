// Text-to-speech with two tiers:
//   1. Google Cloud TTS via Netlify function — Neural2 quality, very natural
//   2. Browser Web Speech API — fallback when Google key is not configured

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Strip markdown/LaTeX so TTS reads naturally
export function cleanForSpeech(raw) {
  let s = String(raw || '');
  s = s.replace(/```[\s\S]*?```/g, ' (code) ').replace(/`([^`]*)`/g, '$1');
  s = s.replace(/\$\$([\s\S]*?)\$\$/g, ' $1 ').replace(/\$([^$]*)\$/g, ' $1 ');
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
    [/\\[a-zA-Z]+/g, ' '],
  ];
  for (const [re, rep] of map) s = s.replace(re, rep);
  s = s.replace(/^\s*[-•]\s+/gm, '. ');
  s = s.replace(/[*_#>|]/g, ' ');
  s = s.replace(/[{}]/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

// ---- OpenAI TTS (primary — neural quality) ----

let _currentAudio = null; // HTMLAudioElement

async function speakViaAPI(text, { onend } = {}) {
  if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
  // Kill any in-progress browser speech so it can't bleed into the API audio
  if (isSpeechSupported()) window.speechSynthesis.cancel();
  const res = await fetch('/.netlify/functions/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: cleanForSpeech(text), voice: 'nova' }),
  });
  if (!res.ok) throw new Error('TTS API failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  _currentAudio = audio;
  audio.onended = () => { URL.revokeObjectURL(url); _currentAudio = null; onend?.(); };
  audio.onerror = () => { URL.revokeObjectURL(url); _currentAudio = null; onend?.(); };
  try {
    await audio.play();
  } catch (e) {
    // Browser blocked autoplay (NotAllowedError) — clean up and let the
    // outer catch fall back to browser speech synthesis.
    URL.revokeObjectURL(url);
    _currentAudio = null;
    throw e;
  }
}

function stopAPI() {
  if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
}

// ---- Browser Web Speech API (fallback) ----

let _cachedVoice = null;
if (isSpeechSupported()) {
  window.speechSynthesis.onvoiceschanged = () => { _cachedVoice = null; };
}

function scoreVoice(v) {
  let score = 0;
  const name = v.name.toLowerCase();
  if (/neural|natural|enhanced|premium|wavenet|studio/i.test(name)) score += 40;
  if (/google/i.test(name)) score += 20;
  if (/microsoft/i.test(name) && !/zira|david|mark/i.test(name)) score += 15;
  if (/samantha|karen|daniel|rishi|serena|oliver/i.test(name)) score += 25;
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

function speakBrowser(text, { onend } = {}) {
  if (!isSpeechSupported()) return;
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
}

function stopBrowser() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

// ---- Unified speak / stop ----
// Tries OpenAI TTS first; if the server returns an error (no key configured),
// falls back silently to browser speech.

export async function speak(text, { onend } = {}) {
  try {
    await speakViaAPI(text, { onend });
  } catch {
    speakBrowser(text, { onend });
  }
}

export function stopSpeaking() {
  stopAPI();
  stopBrowser();
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

// ---- Pub/sub: one active speaker at a time ----
const _listeners = new Set();
let _current = null;
export function setCurrent(id) { _current = id; _listeners.forEach((l) => l(id)); }
export function getCurrent() { return _current; }
export function subscribe(l) { _listeners.add(l); return () => _listeners.delete(l); }
