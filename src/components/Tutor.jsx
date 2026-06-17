import { useEffect, useRef, useState } from 'react';
import { tutor } from '../lib/api.js';
import { fileToAttachment } from '../lib/files.js';
import { getSubjectStats, getSubjectProgress } from '../lib/storage.js';
import { estimateLevel, levelSummary } from '../lib/level.js';
import MathText from './MathText.jsx';
import SpeakButton from './SpeakButton.jsx';

// Pull the plain text out of a message whose content may be a string or blocks.
function textOfContent(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    const t = content.find((b) => b.type === 'text');
    return t ? t.text : '';
  }
  return '';
}

export default function Tutor({ subject, tierId }) {
  const [topicName, setTopicName] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState(null); // { block, preview }
  const [busy, setBusy] = useState(false);
  const [attaching, setAttaching] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const fileRef = useRef(null);

  const starters = [
    `Explain a tricky idea in ${subject.name} simply`,
    `Give me a hint for a hard ${subject.name} question`,
    `Quiz me on ${subject.topics[0]?.name || subject.name}`,
    `How should I revise ${subject.name} for the exam?`,
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

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
      };
    } else {
      userMessage = { role: 'user', content: typed, _text: typed };
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
      setMessages([...next, { role: 'assistant', content: reply, _text: reply }]);
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
              Ask anything, or <span className="font-semibold text-ink">upload a handout</span> (photo or PDF) and I&apos;ll explain it.
            </p>
          </div>
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

      <div className="card flex h-[60vh] flex-col p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-slate2">Try one of these, or tap the paperclip to upload a handout:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {starters.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-xl border border-line bg-surface/70 p-3 text-left text-sm hover:bg-surface">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-line ${
                m.role === 'user' ? 'bg-ink text-paper rounded-br-sm' : 'bg-surface border border-line rounded-bl-sm'
              }`}>
                {m._preview?.kind === 'image' && (
                  <img src={m._preview.url} alt="uploaded handout" className="mb-2 max-h-48 rounded-lg border border-white/20" />
                )}
                {m._preview?.kind === 'pdf' && (
                  <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-surface/15 px-2 py-1 text-sm">
                    📄 {m._preview.name}
                  </div>
                )}
                <MathText>{m._text ?? textOfContent(m.content)}</MathText>
                {m.role === 'assistant' && (
                  <div className="mt-2"><SpeakButton text={m._text ?? textOfContent(m.content)} /></div>
                )}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
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
                <span>📄 {attachment.preview.name}</span>
              )}
              {attachment && (
                <button onClick={() => setAttachment(null)} className="ml-1 text-slate2 hover:text-coral" aria-label="Remove attachment">✕</button>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-line p-3">
          <div className="flex items-end gap-2">
            <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={onPickFile} className="hidden" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy || attaching}
              title="Upload a handout (photo or PDF)"
              className="btn-ghost !px-3 shrink-0"
            >
              📎
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
              placeholder={attachment ? 'Ask about your handout… (or just press Send)' : 'Ask a question…  (Enter to send)'}
              className="max-h-32 flex-1 resize-none rounded-xl border border-line bg-surface px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
            />
            <button className="btn-accent" onClick={() => send()} disabled={busy || attaching || (!input.trim() && !attachment)}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
