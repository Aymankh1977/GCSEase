import { useEffect, useRef, useState } from 'react';
import { tutor } from '../lib/api.js';
import { fileToAttachment } from '../lib/files.js';
import { getSubjectStats, getSubjectProgress } from '../lib/storage.js';
import { estimateLevel, levelSummary } from '../lib/level.js';
import {
  speak, stopSpeaking, isSpeechSupported,
  startListening, isMicSupported,
  subscribe, getCurrent, setCurrent,
} from '../lib/speech.js';
import MathText from './MathText.jsx';

function textOfContent(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    const t = content.find((b) => b.type === 'text');
    return t ? t.text : '';
  }
  return '';
}

// Speak an AI reply and update the speaking-ID pub-sub
function speakReply(text, id, setPlayingId) {
  if (!isSpeechSupported() || !text) return;
  setCurrent(id);
  setPlayingId(id);
  speak(text, {
    onend: () => {
      if (getCurrent() === id) { setCurrent(null); setPlayingId(null); }
    },
  });
}

export default function Tutor({ subject, tierId }) {
  const [topicName, setTopicName] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [busy, setBusy] = useState(false);
  const [attaching, setAttaching] = useState(false);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(isSpeechSupported());
  const [playingId, setPlayingId] = useState(null);
  const endRef = useRef(null);
  const fileRef = useRef(null);
  const pdfRef = useRef(null);
  const recRef = useRef(null);
  const nextIdRef = useRef(0);

  const starters = [
    `Explain a tricky idea in ${subject.name} simply`,
    `Give me a hint for a hard ${subject.name} question`,
    `Quiz me on ${subject.topics[0]?.name || subject.name}`,
    `How should I revise ${subject.name} for the exam?`,
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  // Keep playingId in sync with the pub-sub (so external stops work)
  useEffect(() => subscribe((cur) => { if (!cur) setPlayingId(null); }), []);

  // Clean up mic on unmount
  useEffect(() => () => { recRef.current?.abort(); stopSpeaking(); }, []);

  function toggleMic() {
    if (listening) {
      recRef.current?.abort();
      recRef.current = null;
      setListening(false);
      return;
    }
    setListening(true);
    recRef.current = startListening({
      onResult: (transcript) => {
        setInput(transcript);
        setListening(false);
        recRef.current = null;
      },
      onEnd: () => { setListening(false); recRef.current = null; },
      onError: () => { setListening(false); recRef.current = null; },
    });
  }

  function togglePlay(text, id) {
    if (playingId === id) {
      stopSpeaking();
      setCurrent(null);
      setPlayingId(null);
    } else {
      speakReply(text, id, setPlayingId);
    }
  }

  async function onPickFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    setAttaching(true);
    try {
      const att = await fileToAttachment(file);
      setAttachment(att);
    } catch (err) {
      setError(err.message);
    } finally {
      setAttaching(false);
    }
  }

  async function send(text) {
    const typed = (text ?? input).trim();
    if ((!typed && !attachment) || busy) return;
    setError('');

    let userMessage;
    if (attachment) {
      const question = typed || 'Can you help me understand the key concept in this handout, step by step?';
      userMessage = {
        role: 'user',
        content: [attachment.block, { type: 'text', text: question }],
        _preview: attachment.preview,
        _text: question,
        _id: nextIdRef.current++,
      };
    } else {
      userMessage = { role: 'user', content: typed, _text: typed, _id: nextIdRef.current++ };
    }

    const next = [...messages, userMessage];
    setMessages(next);
    setInput('');
    setAttachment(null);
    setBusy(true);
    try {
      const apiMessages = next.map(({ role, content }) => ({ role, content }));
      const level = estimateLevel(getSubjectStats(subject.id), subject.topics.length, subject.tiered ? tierId : 'all');
      const prog = getSubjectProgress(subject.id);
      const weakTopics = Object.entries(prog)
        .filter(([, p]) => p.mastery != null)
        .sort((a, b) => a[1].mastery - b[1].mastery)
        .slice(0, 3)
        .map(([id]) => subject.topics.find((t) => t.id === id)?.name)
        .filter(Boolean);
      const { reply } = await tutor({
        subject: subject.name, board: subject.board, tier: subject.tier || undefined,
        topicName: topicName || undefined,
        studentLevel: levelSummary(level) || undefined,
        weakTopics: weakTopics.length ? weakTopics : undefined,
        messages: apiMessages,
      });
      const replyId = nextIdRef.current++;
      const replyMsg = { role: 'assistant', content: reply, _text: reply, _id: replyId };
      setMessages([...next, replyMsg]);
      if (autoSpeak) speakReply(reply, replyId, setPlayingId);
    } catch (e) {
      setError(e.message);
      setMessages(messages);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="card rise p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg">{subject.name} tutor</h2>
            <p className="text-sm text-slate2">
              Ask anything — by typing or{' '}
              <span className="font-semibold text-ink">speaking</span> — or{' '}
              <span className="font-semibold text-ink">upload a handout</span> and I&apos;ll explain it.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isSpeechSupported() && (
              <label className="flex cursor-pointer items-center gap-2 text-sm select-none">
                <span className="text-slate2">Auto-read replies</span>
                <span
                  role="switch"
                  aria-checked={autoSpeak}
                  onClick={() => { setAutoSpeak((v) => !v); stopSpeaking(); setPlayingId(null); }}
                  className={`relative inline-block h-5 w-9 rounded-full transition-colors ${autoSpeak ? 'bg-accent' : 'bg-line'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${autoSpeak ? 'translate-x-4' : ''}`} />
                </span>
              </label>
            )}
            <label className="text-sm">
              <span className="mr-2 text-slate2">Focus topic</span>
              <select
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                className="rounded-xl border border-line bg-surface px-3 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
              >
                <option value="">Any</option>
                {subject.topics.map((t) => (<option key={t.id} value={t.name}>{t.name}</option>))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="card flex h-[60vh] flex-col p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-slate2">Tap a starter below, type or speak your question, or upload a PDF / photo:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {starters.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-xl border border-line bg-surface/70 p-3 text-left text-sm hover:bg-surface">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m._id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="mr-2 mt-1 shrink-0">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-accentSoft text-[10px] font-bold tracking-wide text-accent">AI</span>
                </div>
              )}
              <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-line ${
                m.role === 'user'
                  ? 'bg-ink text-paper rounded-br-sm'
                  : 'bg-surface border border-line rounded-bl-sm'
              }`}>
                {m._preview?.kind === 'image' && (
                  <img src={m._preview.url} alt="uploaded handout" className="mb-2 max-h-48 rounded-lg border border-white/20" />
                )}
                {m._preview?.kind === 'pdf' && (
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-lg bg-surface/15 px-2.5 py-1.5 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    {m._preview.name}
                  </div>
                )}
                <MathText>{m._text ?? textOfContent(m.content)}</MathText>
                {m.role === 'assistant' && (
                  <button
                    type="button"
                    onClick={() => togglePlay(m._text ?? textOfContent(m.content), m._id)}
                    title={playingId === m._id ? 'Stop' : 'Listen'}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/60 px-2 py-1 text-xs font-semibold text-slate2 transition hover:bg-surface hover:text-ink"
                  >
                    {playingId === m._id ? 'Stop' : 'Listen'}
                  </button>
                )}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex items-end justify-start gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accentSoft text-[10px] font-bold tracking-wide text-accent shrink-0">AI</span>
              <div className="rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-2.5 text-slate2">
                <span className="inline-flex gap-1">
                  <span className="animate-bounce">·</span>
                  <span className="animate-bounce [animation-delay:0.15s]">·</span>
                  <span className="animate-bounce [animation-delay:0.3s]">·</span>
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {error && <p className="px-4 pb-2 text-sm text-coral">{error}</p>}

        {(attachment || attaching) && (
          <div className="border-t border-line px-3 pt-2">
            <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface/70 px-2 py-1 text-sm">
              {attaching ? (
                <span className="text-slate2">Preparing file…</span>
              ) : attachment.preview.kind === 'image' ? (
                <>
                  <img src={attachment.preview.url} alt="" className="h-8 w-8 rounded object-cover" />
                  <span className="max-w-[12rem] truncate">{attachment.preview.name}</span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  {attachment.preview.name}
                </span>
              )}
              {attachment && (
                <button onClick={() => setAttachment(null)} className="ml-1 text-slate2 hover:text-coral" aria-label="Remove attachment">✕</button>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-line p-3">
          {listening && (
            <div className="mb-2 flex items-center gap-2 rounded-xl bg-accentSoft px-3 py-2 text-sm font-semibold text-accent">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
              </span>
              Listening… speak your question
            </div>
          )}
          <div className="flex items-end gap-2">
            {/* image upload */}
            <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} className="hidden" />
            {/* pdf upload */}
            <input ref={pdfRef} type="file" accept="application/pdf" onChange={onPickFile} className="hidden" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy || attaching}
              title="Upload a photo or image"
              className="btn-ghost !px-2.5 shrink-0"
            >
              {/* image icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </button>
            <button
              type="button"
              onClick={() => pdfRef.current?.click()}
              disabled={busy || attaching}
              title="Upload a PDF"
              className="btn-ghost !px-2.5 shrink-0"
            >
              {/* pdf icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </button>
            {isMicSupported() && (
              <button
                type="button"
                onClick={toggleMic}
                disabled={busy}
                title={listening ? 'Stop listening' : 'Speak your question'}
                className={`btn-ghost !px-2.5 shrink-0 transition ${listening ? 'text-accent ring-2 ring-accent rounded-xl' : ''}`}
              >
                {/* microphone */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              </button>
            )}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
              placeholder={
                listening ? 'Listening…'
                : attachment ? 'Ask about your handout… (or just press Send)'
                : 'Ask a question… (Enter to send, or press 🎙)'
              }
              className="max-h-32 flex-1 resize-none rounded-xl border border-line bg-surface px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
            />
            <button className="btn-accent" onClick={() => send()} disabled={busy || attaching || (!input.trim() && !attachment)}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
