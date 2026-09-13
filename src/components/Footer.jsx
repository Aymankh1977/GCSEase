import { DentEdTechMark } from './Logo.jsx';

export default function Footer({ children, onNav }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-line py-5 text-center text-xs text-slate2">
      {children && <div className="mb-2">{children}</div>}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span>© {year} GCSEasy</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1">
          a <DentEdTechMark size={14} className="translate-y-px" /> DentEdTech platform
        </span>
        <span aria-hidden>·</span>
        <button onClick={() => onNav?.('privacy')} className="hover:text-ink underline underline-offset-2">Privacy Policy</button>
        <span aria-hidden>·</span>
        <button onClick={() => onNav?.('terms')} className="hover:text-ink underline underline-offset-2">Terms of Service</button>
        <span aria-hidden>·</span>
        <a href="mailto:support@gcseasy.org" className="hover:text-ink underline underline-offset-2">support@gcseasy.org</a>
      </div>
    </footer>
  );
}
