import { DentEdTechMark } from './Logo.jsx';

// Global footer. Per brand guidance, DentEdTech (the platform owner) is shown
// ONLY here, in the copyright line, alongside the current year.
export default function Footer({ children }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-line py-5 text-center text-xs text-slate2">
      {children && <div className="mb-2">{children}</div>}
      <div className="flex items-center justify-center gap-1.5">
        <span>© {year} GCSEase</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1">
          a <DentEdTechMark size={14} className="translate-y-px" /> DentEdTech platform
        </span>
      </div>
    </footer>
  );
}
