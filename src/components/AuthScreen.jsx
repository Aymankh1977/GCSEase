import { useState } from 'react';
import { signUp, logIn } from '../lib/auth.js';
import { importData } from '../lib/storage.js';
import { GCSEaseLogo } from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import Footer from './Footer.jsx';

export default function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const user = mode === 'signup' ? await signUp(form) : await logIn(form);
      onAuthed?.(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function onImport(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(''); setNotice('');
    try {
      const payload = JSON.parse(await file.text());
      importData(payload);
      setNotice('Backup loaded. Log in (or sign up) to see your restored progress.');
    } catch (err) {
      setError(err.message || 'Could not read that backup file.');
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <GCSEaseLogo size={40} />
            <span className="font-display text-xl font-semibold">GCSEase</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-8 px-4 py-8 lg:grid-cols-2">
        {/* Pitch */}
        <section className="order-2 lg:order-1">
          <div className="mb-4 flex items-center gap-3">
            <GCSEaseLogo size={64} />
            <div>
              <h1 className="font-display text-3xl font-semibold">GCSEase</h1>
              <p className="text-slate2">GCSE revision, made easy.</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-slate2">
            <li>✓ All UK exam boards — AQA, Edexcel, OCR, WJEC/Eduqas, CCEA.</li>
            <li>✓ Foundation &amp; Higher tiers, every core GCSE subject.</li>
            <li>✓ Grade 1–9 guides so you know exactly what each grade needs.</li>
            <li>✓ AI practice questions, instant marking and a 24/7 tutor.</li>
            <li>✓ Your progress is saved to your account and restored when you log back in.</li>
          </ul>
        </section>

        {/* Auth card */}
        <section className="order-1 lg:order-2">
          <div className="card p-6 sm:p-7">
            <div className="mb-5 flex rounded-xl border border-line bg-surface/60 p-1">
              {['signup', 'login'].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    mode === m ? 'bg-ink text-paper' : 'text-slate2 hover:text-ink'
                  }`}
                >
                  {m === 'signup' ? 'Create account' : 'Log in'}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === 'signup' && (
                <Field label="Your name">
                  <input value={form.name} onChange={set('name')} autoComplete="name" placeholder="e.g. Alex Taylor" className={inputCls} />
                </Field>
              )}
              <Field label="Email">
                <input type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com" className={inputCls} />
              </Field>
              <Field label="Password">
                <input type="password" value={form.password} onChange={set('password')} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder="At least 6 characters" className={inputCls} />
              </Field>


              {error && <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}
              {notice && <p className="rounded-lg bg-accentSoft px-3 py-2 text-sm text-accent">{notice}</p>}

              <button type="submit" className="btn-accent w-full" disabled={busy}>
                {busy ? 'Just a moment…' : mode === 'signup' ? 'Create my account' : 'Log in'}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-slate2">
              Got a backup from another device?{' '}
              <label className="cursor-pointer font-semibold text-accent hover:underline">
                Import it
                <input type="file" accept="application/json,.json" onChange={onImport} className="hidden" />
              </label>
            </p>
          </div>
          <p className="mt-3 px-2 text-center text-xs text-slate2">
            Your account is stored on this device. Export a backup any time from your profile to move it.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const inputCls =
  'mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate2">{label}</span>
      {children}
    </label>
  );
}
