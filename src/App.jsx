import { useEffect, useMemo, useState } from 'react';
import { SUBJECTS_BY_ID } from './data/subjects.js';
import { BOARDS, BOARDS_BY_ID, boardName } from './data/boards.js'; // BOARDS still used in boardPickerModal
import { TIER_LIST, TIERS } from './data/grades.js';
import { getCurrentUser, onAuthChange, isAuthReady, updateProfile } from './lib/auth.js';
import { onDataChange } from './lib/storage.js';

import AuthScreen from './components/AuthScreen.jsx';
import Home from './components/Home.jsx';
import GradeGuide from './components/GradeGuide.jsx';
import Dashboard from './components/Dashboard.jsx';
import Practice from './components/Practice.jsx';
import Tutor from './components/Tutor.jsx';
import TopicBrowser from './components/TopicBrowser.jsx';
import Checklist from './components/Checklist.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import AccountMenu from './components/AccountMenu.jsx';
import Footer from './components/Footer.jsx';
import { GCSEaseLogo } from './components/Logo.jsx';

const EXAM_VIEWS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'practice', label: 'Practice' },
  { id: 'tutor', label: 'Tutor' },
  { id: 'topics', label: 'Topics' },
  { id: 'grades', label: 'Grades' },
];
const PORTFOLIO_VIEWS = [
  { id: 'checklist', label: 'Checklist' },
  { id: 'tutor', label: 'Tutor' },
  { id: 'grades', label: 'Grades' },
];

export default function App() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [ready, setReady] = useState(() => isAuthReady());
  const [boardId, setBoardId] = useState(() => getCurrentUser()?.board || 'aqa');
  const [tierId, setTierId] = useState(() => getCurrentUser()?.tier || 'higher');

  const [route, setRoute] = useState('home'); // 'home' | 'grades'
  const [subjectId, setSubjectId] = useState(null);
  const [pendingSubjectId, setPendingSubjectId] = useState(null); // waiting for board pick
  const [view, setView] = useState('dashboard');
  const [practiceTopic, setPracticeTopic] = useState(null);
  const [dataNonce, setDataNonce] = useState(0); // bump to refresh progress after sync

  useEffect(() => onAuthChange((u) => {
    setUser(u);
    setReady(true);
    if (u) { setBoardId(u.board || 'aqa'); setTierId(u.tier || 'higher'); }
    else { setSubjectId(null); setRoute('home'); }
  }), []);

  useEffect(() => onDataChange(() => setDataNonce((n) => n + 1)), []);

  function chooseBoard(id) { setBoardId(id); updateProfile({ board: id }); }
  function chooseTier(id) { setTierId(id); updateProfile({ tier: id }); }

  const catalogue = subjectId ? SUBJECTS_BY_ID[subjectId] : null;
  // Runtime subject = catalogue entry + the student's board/tier choices.
  const subject = useMemo(() => {
    if (!catalogue) return null;
    return {
      ...catalogue,
      boardId,
      board: boardName(boardId),
      tierId: catalogue.tiered ? tierId : null,
      tier: catalogue.tiered ? TIERS[tierId]?.short : null,
    };
  }, [catalogue, boardId, tierId]);

  const views = subject?.mode === 'portfolio' ? PORTFOLIO_VIEWS : EXAM_VIEWS;

  function openSubject(id) {
    // Show board picker first, then enter subject workspace
    setPendingSubjectId(id);
  }
  function confirmSubject() {
    if (!pendingSubjectId) return;
    setSubjectId(pendingSubjectId);
    setView(SUBJECTS_BY_ID[pendingSubjectId]?.mode === 'portfolio' ? 'checklist' : 'dashboard');
    setPracticeTopic(null);
    setPendingSubjectId(null);
  }
  function startPractice(topicId) { setPracticeTopic(topicId); setView('practice'); }
  function goHome() { setSubjectId(null); setRoute('home'); }

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex items-center gap-3 text-slate2">
          <GCSEaseLogo size={40} />
          <span className="font-display text-lg">Loading GCSEase…</span>
        </div>
      </div>
    );
  }
  if (!user) return <AuthScreen onAuthed={setUser} />;

  // ---- Header (shared across in-app screens) ----
  const header = (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5">
        <button onClick={goHome} className="flex items-center gap-2.5 text-left">
          <GCSEaseLogo size={36} />
          <span className="font-display text-lg font-semibold">GCSEase</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-0.5 rounded-lg border border-line bg-surface/60 p-0.5 sm:flex">
            {TIER_LIST.map((t) => (
              <button key={t.id} onClick={() => chooseTier(t.id)}
                className={`rounded-md px-2 py-1 text-xs font-semibold transition ${tierId === t.id ? 'bg-ink text-paper' : 'text-slate2 hover:text-ink'}`}>
                {t.short}
              </button>
            ))}
          </div>
          <ThemeToggle />
          <AccountMenu user={user} onChanged={() => setDataNonce((n) => n + 1)} />
        </div>
      </div>
    </header>
  );

  // ---- Board picker modal (shown after subject card clicked, before opening workspace) ----
  const pendingCatalogue = pendingSubjectId ? SUBJECTS_BY_ID[pendingSubjectId] : null;
  const boardPickerModal = pendingCatalogue && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-md p-6 shadow-lift space-y-5 rise">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-accentSoft text-2xl">{pendingCatalogue.icon}</span>
          <div>
            <h2 className="font-display text-xl">{pendingCatalogue.name}</h2>
            <p className="text-sm text-slate2">Choose your exam board</p>
          </div>
        </div>
        <p className="text-sm text-slate2">Questions and marking are tailored to your board&apos;s specification.</p>
        <div className="grid gap-2">
          {BOARDS.map((b) => {
            const active = b.id === boardId;
            return (
              <button
                key={b.id}
                onClick={() => { chooseBoard(b.id); }}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${active ? 'border-transparent text-white shadow-card' : 'border-line bg-surface/70 hover:bg-surface'}`}
                style={active ? { background: b.color } : undefined}
              >
                <div className="flex-1">
                  <span className="block text-sm font-semibold">{b.name}</span>
                  <span className={`block text-xs ${active ? 'text-white/80' : 'text-slate2'}`}>{b.region} · {b.blurb}</span>
                </div>
                {active && <span className="text-white text-base">✓</span>}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={() => setPendingSubjectId(null)} className="btn-ghost flex-1">Cancel</button>
          <button onClick={confirmSubject} className="btn-accent flex-1">
            Start {pendingCatalogue.name} →
          </button>
        </div>
      </div>
    </div>
  );

  // ---- Home / grade-guide (no subject open) ----
  if (!subject) {
    return (
      <div className="flex min-h-screen flex-col">
        {boardPickerModal}
        {header}
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
          {route === 'grades' ? (
            <div className="space-y-4">
              <button onClick={() => setRoute('home')} className="text-sm font-semibold text-slate2 hover:text-ink">← Back to subjects</button>
              <GradeGuide tierId={tierId} />
            </div>
          ) : (
            <Home
              user={user}
              boardId={boardId}
              tierId={tierId}
              onBoard={chooseBoard}
              onTier={chooseTier}
              onPick={openSubject}
              onGrades={() => setRoute('grades')}
            />
          )}
        </main>
        <Footer />
      </div>
    );
  }

  // ---- Subject workspace ----
  return (
    <div className="flex min-h-screen flex-col">
      {header}
      <div className="border-b border-line bg-surface/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2">
          <button onClick={goHome} className="flex items-center gap-2 text-left">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accentSoft text-lg">{subject.icon}</span>
            <span className="leading-tight">
              <span className="block font-display text-base font-semibold">{subject.name}</span>
              <span className="block text-xs text-slate2">{subject.board}{subject.tier ? ` · ${subject.tier}` : ''} · ← all subjects</span>
            </span>
          </button>
          <nav className="flex items-center gap-1 overflow-x-auto rounded-xl border border-line bg-surface/60 p-1">
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${view === v.id ? 'bg-ink text-paper' : 'text-slate2 hover:text-ink'}`}
              >
                {v.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main key={dataNonce} className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {view === 'dashboard' && <Dashboard subject={subject} tierId={tierId} onPractice={startPractice} onGrades={() => setView('grades')} />}
        {view === 'practice' && (
          <Practice subject={subject} tierId={tierId} initialTopicId={practiceTopic} onTopicConsumed={() => setPracticeTopic(null)} />
        )}
        {view === 'tutor' && <Tutor subject={subject} tierId={tierId} />}
        {view === 'topics' && <TopicBrowser subject={subject} onPractice={startPractice} />}
        {view === 'checklist' && <Checklist subject={subject} />}
        {view === 'grades' && <GradeGuide tierId={subject.tiered ? tierId : 'higher'} subjectName={subject.name} />}
      </main>

      <Footer>
        <span>{subject.name} · {subject.board}{subject.tier ? ` · ${subject.tier} tier` : ''} · {subject.paper}</span>
      </Footer>
    </div>
  );
}
