import { useEffect, useRef, useState } from 'react';
import { logOut, logIn } from '../lib/auth.js';
import { exportData, importData } from '../lib/storage.js';

export default function AccountMenu({ user, onChanged }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('menu'); // 'menu' | 'switch'
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setView('menu'); } }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const initials = (user?.name || '?').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function download() {
    const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gcsease-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Backup downloaded.');
  }

  async function onImport(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      importData(JSON.parse(await file.text()));
      setMsg('Backup restored.');
      onChanged?.();
    } catch (err) {
      setMsg(err.message || 'Could not read that file.');
    }
  }

  async function switchUser(e) {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Enter email and password.'); return; }
    setBusy(true); setError('');
    try {
      // Sign out current user locally, then sign in as new user
      await logOut();
      // logOut does window.location.replace('/') so the next line is only
      // reached in local (non-Supabase) mode where logOut is synchronous.
      const newUser = await logIn(form);
      onChanged?.();
      setOpen(false);
      setView('menu');
      // Trigger App re-render by propagating the new user up
      window.dispatchEvent(new Event('gcsease:userChanged'));
      _ = newUser; // suppress unused warning
    } catch (err) {
      setBusy(false);
      setError(err.message || 'Could not switch accounts.');
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((o) => !o); setView('menu'); setError(''); setMsg(''); }}
        className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-sm font-bold text-paper"
        title={user?.name}
        aria-label="Account menu"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-72 rounded-xl border border-line bg-surface p-2 shadow-lift">

          {view === 'menu' && (
            <>
              <div className="px-3 py-2">
                <p className="font-semibold leading-tight">{user?.name}</p>
                <p className="truncate text-xs text-slate2">{user?.email}</p>
              </div>
              <div className="my-1 h-px bg-line" />
              <button onClick={download} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-paper">
                Back up my data
              </button>
              <label className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm hover:bg-paper">
                Restore from backup
                <input type="file" accept="application/json,.json" onChange={onImport} className="hidden" />
              </label>
              {msg && <p className="px-3 py-1 text-xs text-accent">{msg}</p>}
              <div className="my-1 h-px bg-line" />
              <button
                onClick={() => { setView('switch'); setError(''); setForm({ email: '', password: '' }); }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-paper"
              >
                Change user
              </button>
              <button
                onClick={() => { setBusy(true); logOut(); }}
                disabled={busy}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-coral hover:bg-paper disabled:opacity-50"
              >
                {busy ? 'Logging out…' : 'Log out'}
              </button>
            </>
          )}

          {view === 'switch' && (
            <>
              <div className="px-3 py-2">
                <p className="font-semibold">Change user</p>
                <p className="text-xs text-slate2">Log in as a different account.</p>
              </div>
              <div className="my-1 h-px bg-line" />
              <form onSubmit={switchUser} className="space-y-2 px-3 py-2">
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="Email"
                  autoFocus
                  className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                />
                <input
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Password"
                  className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                />
                {error && <p className="text-xs text-coral">{error}</p>}
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setView('menu')} className="btn-ghost flex-1 text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={busy} className="btn-accent flex-1 text-sm">
                    {busy ? 'Switching…' : 'Switch'}
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      )}
    </div>
  );
}
