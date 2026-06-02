import { useEffect, useRef, useState } from 'react';
import { TOPICS } from '../data/topics.js';
import { tutor } from '../lib/api.js';
import MathText from './MathText.jsx';

const STARTERS = [
  'I get stuck rationalising surd denominators — can you walk me through one?',
  'How do I find the nth term of a quadratic sequence?',
  'When do I use the quadratic formula vs completing the square?',
  'Explain how to share an amount in a ratio like 3:5.',
];

export default function Tutor() {
  const [topicName, setTopicName] = useState('');
  const [messages, setMessages] = useState([]); // {role, content}
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setError('');
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const { reply } = await tutor({ topicName: topicName || undefined, messages: next });
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e.message);
      setMessages(messages); // roll back the optimistic user turn on failure
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="card rise p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg">Maths tutor</h2>
            <p className="text-sm text-slate2">
              Ask anything. I&apos;ll give hints and nudge you to the answer — not just hand it over.
            </p>
          </div>
          <label className="text-sm">
            <span className="mr-2 text-slate2">Focus topic</span>
            <select
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="rounded-xl border border-line bg-white px-3 py-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
            >
              <option value="">Any</option>
              {TOPICS.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="card flex h-[60vh] flex-col p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-slate2">Try one of these to get going:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-line bg-white/70 p-3 text-left text-sm hover:bg-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-ink text-paper rounded-br-sm'
                    : 'bg-white border border-line rounded-bl-sm'
                }`}
              >
                <MathText>{m.content}</MathText>
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-2.5 text-slate2">
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

        <div className="border-t border-line p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Ask a maths question…  (Enter to send, Shift+Enter for a new line)"
              className="max-h-32 flex-1 resize-none rounded-xl border border-line bg-white px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
            />
            <button className="btn-accent" onClick={() => send()} disabled={busy || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
