import { useState } from 'react';
import { PAPER_INFO } from './data/topics.js';
import Dashboard from './components/Dashboard.jsx';
import Practice from './components/Practice.jsx';
import Tutor from './components/Tutor.jsx';
import TopicBrowser from './components/TopicBrowser.jsx';

const VIEWS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'practice', label: 'Practice' },
  { id: 'tutor', label: 'Tutor' },
  { id: 'topics', label: 'Topics' },
];

export default function App() {
  const [view, setView] = useState('dashboard');
  // optional topic to deep-link into Practice from the dashboard/browser
  const [practiceTopic, setPracticeTopic] = useState(null);

  function startPractice(topicId) {
    setPracticeTopic(topicId);
    setView('practice');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-paper font-display text-xl">
              √
            </div>
            <div className="leading-tight">
              <h1 className="font-display text-lg font-semibold">Revise</h1>
              <p className="text-xs text-slate2">GCSE Maths · {PAPER_INFO.tier}</p>
            </div>
          </div>
          <nav className="flex items-center gap-1 rounded-xl border border-line bg-white/60 p-1">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  view === v.id ? 'bg-ink text-paper' : 'text-slate2 hover:text-ink'
                }`}
              >
                {v.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {view === 'dashboard' && <Dashboard onPractice={startPractice} />}
        {view === 'practice' && (
          <Practice initialTopicId={practiceTopic} onTopicConsumed={() => setPracticeTopic(null)} />
        )}
        {view === 'tutor' && <Tutor />}
        {view === 'topics' && <TopicBrowser onPractice={startPractice} />}
      </main>

      <footer className="border-t border-line py-4 text-center text-xs text-slate2">
        {PAPER_INFO.board} · {PAPER_INFO.qualification} · Paper 1: {PAPER_INFO.ppe.paper1} · Paper 2:{' '}
        {PAPER_INFO.ppe.paper2}
      </footer>
    </div>
  );
}
