import { useEffect, useMemo, useState } from 'react';
import { topicsByGroup } from '../data/subjects.js';
import { gradeBandForDifficulty } from '../data/grades.js';
import { generateQuestion, markAnswer } from '../lib/api.js';
import { recordAttempt, getProgress, getSubjectStats } from '../lib/storage.js';
import { estimateLevel, levelSummary } from '../lib/level.js';
import MathText from './MathText.jsx';
import SpeakButton from './SpeakButton.jsx';

const DIFFS = [
  { v: 1, label: 'Build-up' },
  { v: 2, label: 'Standard' },
  { v: 3, label: 'Stretch' },
];

function ScorePill({ score }) {
  const map = {
    1: { t: 'Strong', c: 'bg-accent text-white' },
    0.5: { t: 'Partial', c: 'bg-gold text-white' },
    0: { t: 'Try again', c: 'bg-coral text-white' },
  };
  const s = map[score] || map[0];
  return <span className={`rounded-full px-3 py-1 text-sm font-semibold ${s.c}`}>{s.t}</span>;
}

const partLabel = (p, i) => (p.label ? `(${p.label})` : `Part ${i + 1}`);

export default function Practice({ subject, tierId, initialTopicId, onTopicConsumed }) {
  const grouped = useMemo(() => topicsByGroup(subject), [subject]);
  const topicsById = useMemo(() => Object.fromEntries(subject.topics.map((t) => [t.id, t])), [subject]);
  const [topicId, setTopicId] = useState(initialTopicId || subject.topics[0].id);
  const [difficulty, setDifficulty] = useState(2);
  const [q, setQ] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [seen, setSeen] = useState([]);
  const [phase, setPhase] = useState('idle');
  const [error, setError] = useState('');

  const topic = topicsById[topicId];

  useEffect(() => {
    if (initialTopicId) {
      setTopicId(initialTopicId);
      onTopicConsumed?.();
      loadQuestion(initialTopicId, difficulty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTopicId]);

  async function loadQuestion(tid = topicId, diff = difficulty) {
    const t = topicsById[tid];
    setError(''); setResult(null); setAnswers([]); setQ(null); setPhase('loadingQ');
    try {
      const level = estimateLevel(getSubjectStats(subject.id), subject.topics.length, subject.tiered ? tierId : 'all');
      const data = await generateQuestion({
        subject: subject.name, board: subject.board, markingStyle: subject.markingStyle,
        tier: subject.tier || undefined,
        gradeBand: gradeBandForDifficulty(diff, subject.tiered ? tierId : 'higher'),
        studentLevel: levelSummary(level) || undefined,
        topicName: t.name, focus: t.focus, difficulty: diff, exclude: seen,
      });
      const parts = Array.isArray(data.parts) && data.parts.length
        ? data.parts
        : [{ label: '', prompt: data.question || '', marks: data.marks || 3 }];
      const marks = data.marks || parts.reduce((s, p) => s + (p.marks || 0), 0);
      setQ({ context: data.context || '', parts, marks });
      setAnswers(new Array(parts.length).fill(''));
      const marker = [data.context, ...parts.map((p) => p.prompt)].filter(Boolean).join(' | ');
      setSeen((s) => [...s, marker].slice(-6));
      setPhase('answering');
    } catch (e) {
      setError(e.message); setPhase('idle');
    }
  }

  function setAnswer(i, val) {
    setAnswers((a) => { const n = [...a]; n[i] = val; return n; });
  }

  const allAnswered = q && answers.length === q.parts.length && answers.every((a) => a.trim());
  const multi = q && q.parts.length > 1;

  async function submit() {
    if (!allAnswered) return;
    setPhase('marking'); setError('');
    try {
      const r = await markAnswer({
        subject: subject.name, board: subject.board, markingStyle: subject.markingStyle, topicName: topic.name,
        context: q.context,
        parts: q.parts.map((p, i) => ({ label: p.label, prompt: p.prompt, marks: p.marks, answer: answers[i] })),
      });
      setResult(r);
      recordAttempt(subject.id, topic.id, r.score, difficulty);
      setPhase('marked');
    } catch (e) {
      setError(e.message); setPhase('answering');
    }
  }

  const prog = getProgress(subject.id, topicId);
  const readAloud = result
    ? [result.verdict, ...(result.parts || []).map((p) => `${p.label ? p.label + '. ' : ''}${p.comment}`), result.feedback, result.workedSolution]
        .filter(Boolean).join('. ')
    : '';

  return (
    <div className="space-y-5">
      <div className="card rise p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase tracking-wide text-slate2">Topic</span>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
            >
              {Object.entries(grouped).map(([key, topics]) =>
                topics.length ? (
                  <optgroup key={key} label={subject.groups?.[key]?.label || key}>
                    {topics.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                  </optgroup>
                ) : null
              )}
            </select>
          </label>

          <div className="block">
            <span className="text-xs uppercase tracking-wide text-slate2">Difficulty</span>
            <div className="mt-1 flex gap-1 rounded-xl border border-line bg-surface p-1">
              {DIFFS.map((d) => (
                <button
                  key={d.v}
                  onClick={() => setDifficulty(d.v)}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-sm font-semibold transition ${
                    difficulty === d.v ? 'bg-ink text-paper' : 'text-slate2 hover:text-ink'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate2">
            {prog.attempts > 0 ? `${prog.correct}/${prog.attempts} correct so far on this topic` : 'New topic — no attempts yet'}
          </p>
          <button className="btn-accent" onClick={() => loadQuestion()} disabled={phase === 'loadingQ'}>
            {phase === 'loadingQ' ? 'Writing a question…' : q ? 'New question' : 'Start'}
          </button>
        </div>
      </div>

      {error && <div className="card border-coral/40 p-4 text-sm text-coral">{error}</div>}

      {q && (
        <div className="card rise p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="chip">{topic.name}</span>
            <span className="text-sm font-semibold text-slate2">{q.marks} mark{q.marks === 1 ? '' : 's'}</span>
          </div>

          {q.context && (
            <div className="mb-4 leading-relaxed whitespace-pre-line"><MathText>{q.context}</MathText></div>
          )}

          <div className="space-y-5">
            {q.parts.map((p, i) => {
              const rp = result?.parts?.[i];
              return (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-lg leading-relaxed whitespace-pre-line">
                      {multi && <span className="mr-1 font-semibold text-slate2">{partLabel(p, i)}</span>}
                      <MathText>{p.prompt}</MathText>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-slate2">[{p.marks}]</span>
                  </div>
                  <textarea
                    value={answers[i] ?? ''}
                    onChange={(e) => setAnswer(i, e.target.value)}
                    disabled={phase === 'marked' || phase === 'marking'}
                    rows={multi ? 3 : 5}
                    placeholder={multi ? `Your answer to ${partLabel(p, i)}…` : 'Write your answer here — show your working or your full response.'}
                    className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 disabled:bg-line/20"
                  />
                  {rp && (
                    <div className="mt-1 flex items-start gap-2 text-sm">
                      <span className={`shrink-0 rounded-md px-2 py-0.5 font-semibold ${
                        rp.awarded >= rp.marks ? 'bg-accent text-white' : rp.awarded > 0 ? 'bg-gold text-white' : 'bg-coral text-white'
                      }`}>{rp.awarded}/{rp.marks}</span>
                      <span className="text-slate2"><MathText>{rp.comment}</MathText></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {phase !== 'marked' && (
            <>
              <button className="btn-primary mt-4" onClick={submit} disabled={phase === 'marking' || !allAnswered}>
                {phase === 'marking' ? 'Marking…' : (multi ? 'Mark my answers' : 'Mark my answer')}
              </button>
              {multi && !allAnswered && <p className="mt-2 text-xs text-slate2">Answer every part to submit.</p>}
            </>
          )}
        </div>
      )}

      {result && (
        <div className="card rise p-5">
          <div className="flex items-center gap-3">
            <ScorePill score={result.score} />
            <p className="font-display text-lg">{result.verdict}</p>
            <div className="ml-auto"><SpeakButton text={readAloud} /></div>
          </div>
          {result.feedback && (
            <div className="mt-3 rounded-xl bg-accentSoft/60 p-3 leading-relaxed whitespace-pre-line"><MathText>{result.feedback}</MathText></div>
          )}
          {result.workedSolution && (
            <details className="mt-3 group" open={result.score < 1}>
              <summary className="cursor-pointer select-none font-semibold text-slate2 group-open:text-ink">
                Model answer &amp; mark scheme
              </summary>
              <div className="mt-2 leading-relaxed whitespace-pre-line"><MathText>{result.workedSolution}</MathText></div>
            </details>
          )}
          <div className="mt-4 flex gap-2">
            <button className="btn-accent" onClick={() => loadQuestion()}>Next question</button>
          </div>
        </div>
      )}

      {!q && phase === 'idle' && !error && (
        <div className="card p-8 text-center text-slate2">
          <p className="font-display text-xl text-ink">Ready when you are.</p>
          <p className="mt-1">Pick a topic and difficulty, then press Start for an exam-style question.</p>
        </div>
      )}
    </div>
  );
}
