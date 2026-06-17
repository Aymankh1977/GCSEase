import { useEffect, useRef, useState } from 'react';
import { logOut } from '../lib/auth.js';
import { exportData, importData } from '../lib/storage.js';
import { boardName } from '../data/boards.js';
import { TIERS } from '../data/grades.js';

// Profile dropdown: shows who is logged in, lets the student back up / restore
// their data ("regain your data"), and log out.
export default function AccountMenu({ user, onChanged }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const initials = (user?.name || '?').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

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
      setMsg('Backup restored — your progress is merged in.');
      onChanged?.();
    } catch (err) {
      setMsg(err.message || 'Could not read that file.');
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-sm font-bold text-paper"
        title={user?.name}
        aria-label="Account menu"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-64 rounded-xl border border-line bg-surface p-2 shadow-lift">
          <div className="px-3 py-2">
            <p className="font-semibold leading-tight">{user?.name}</p>
            <p className="truncate text-xs text-slate2">{user?.email}</p>
            <p className="mt-1 text-xs text-slate2">
              {boardName(user?.board)}{user?.tier ? ` · ${TIERS[user.tier]?.short} tier` : ''}
            </p>
          </div>
          <div className="my-1 h-px bg-line" />
          <button onClick={download} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-paper">
            ⬇️ Back up my data
          </button>
          <label className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm hover:bg-paper">
            ⬆️ Restore from backup
            <input type="file" accept="application/json,.json" onChange={onImport} className="hidden" />
          </label>
          <div className="my-1 h-px bg-line" />
          <button onClick={() => { logOut(); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-coral hover:bg-paper">
            Log out
          </button>
          {msg && <p className="px-3 py-1 text-xs text-accent">{msg}</p>}
        </div>
      )}
    </div>
  );
}
