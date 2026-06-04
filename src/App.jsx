import { useState } from 'react';
import { SUBJECTS_BY_ID } from './data/subjects.js';
import SubjectHome from './components/SubjectHome.jsx';
import Dashboard from './components/Dashboard.jsx';
import Practice from './components/Practice.jsx';
import Tutor from './components/Tutor.jsx';
import TopicBrowser from './components/TopicBrowser.jsx';
import Checklist from './components/Checklist.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';

const EXAM_VIEWS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'practice', label: 'Practice' },
  { id: 'tutor', label: 'Tutor' },
  { id: 'topics', label: 'Topics' },
];
const PORTFOLIO_VIEWS = [
  { id: 'checklist', label: 'Checklist' },
  { id: 'tutor', label: 'Tutor' },
];

export default function App() {
  const [subjectId, setSubjectId] = useState(null);
  const [view, setView] = useState('dashboard');
  const [practiceTopic, setPracticeTopic] = useState(null);

  const subject = subjectId ? SUBJECTS_BY_ID[subjectId] : null;
  const views = subject?.mode === 'portfolio' ? PORTFOLIO_VIEWS : EXAM_VIEWS;

  function openSubject(id) {
    setSubjectId(id);
    setView(SUBJECTS_BY_ID[id]?.mode === 'portfolio' ? 'checklist' : 'dashboard');
    setPracticeTopic(null);
  }
  function startPractice(topicId) {
    setPracticeTopic(topicId);
    setView('practice');
  }

  if (!subject) {
    return <SubjectHome onPick={openSubject} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
          <button onClick={() => setSubjectId(null)} className="flex items-center gap-3 text-left">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-paper font-display text-lg">
              {subject.icon || '✏️'}
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-semibold">{subject.name}</span>
              <span className="block text-xs text-slate2">{subject.tier ? subject.tier + ' · ' : ''}← all subjects</span>
            </span>
          </button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <nav className="flex items-center gap-1 rounded-xl border border-line bg-surface/60 p-1">
            {views.map((v) => (
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
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {view === 'dashboard' && <Dashboard subject={subject} onPractice={startPractice} />}
        {view === 'practice' && (
          <Practice subject={subject} initialTopicId={practiceTopic} onTopicConsumed={() => setPracticeTopic(null)} />
        )}
        {view === 'tutor' && <Tutor subject={subject} />}
        {view === 'topics' && <TopicBrowser subject={subject} onPractice={startPractice} />}
        {view === 'checklist' && <Checklist subject={subject} />}
      </main>

      <footer className="border-t border-line py-4 text-center text-xs text-slate2">
        {subject.board} · {subject.paper} · {subject.examLabel}
      </footer>
    </div>
  );
}
