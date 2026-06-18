import { useMemo } from 'react';
import katex from 'katex';

// ---- LaTeX rendering ----

function renderLatex(token, key) {
  const display = token.type === 'block';
  try {
    const html = katex.renderToString(token.tex, {
      displayMode: display,
      throwOnError: false,
      strict: false,
    });
    return (
      <span
        key={key}
        className={display ? 'block my-2 overflow-x-auto' : 'inline'}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <span key={key}>{token.tex}</span>;
  }
}

// ---- Inline markdown (bold, italic, code) ----
// Returns an array of strings / React elements.

function renderInline(text, keyPrefix) {
  const parts = [];
  // Order matters: ** before * so bold isn't parsed as two italics
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`/gs;
  let last = 0, m, idx = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] != null) parts.push(<strong key={`${keyPrefix}-b${idx}`}>{m[1]}</strong>);
    else if (m[2] != null) parts.push(<em key={`${keyPrefix}-i${idx}`}>{m[2]}</em>);
    else if (m[3] != null) parts.push(
      <code key={`${keyPrefix}-c${idx}`} className="rounded bg-ink/10 px-1 font-mono text-[0.85em]">{m[3]}</code>
    );
    last = re.lastIndex;
    idx++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// ---- Block-level markdown line renderer ----

function renderLine(line, lineKey) {
  // Horizontal rule
  if (/^---+$/.test(line.trim())) {
    return <hr key={lineKey} className="my-2 border-line" />;
  }
  // Headings: # ## ###
  const heading = line.match(/^(#{1,3})\s+(.+)/);
  if (heading) {
    const level = heading[1].length;
    const cls =
      level === 1 ? 'block font-bold text-base mt-3 mb-1' :
      level === 2 ? 'block font-bold text-sm mt-2 mb-0.5' :
                    'block font-semibold text-sm mt-1.5';
    return <span key={lineKey} className={cls}>{renderInline(heading[2], lineKey)}</span>;
  }
  // Bullet list item: - or *
  const bullet = line.match(/^\s*[-*]\s+(.*)/);
  if (bullet) {
    return (
      <span key={lineKey} className="flex gap-1.5">
        <span className="mt-px shrink-0 select-none font-bold">·</span>
        <span>{renderInline(bullet[1], lineKey)}</span>
      </span>
    );
  }
  // Numbered list: 1. 2. etc
  const numbered = line.match(/^\s*(\d+)\.\s+(.*)/);
  if (numbered) {
    return (
      <span key={lineKey} className="flex gap-1.5">
        <span className="mt-px shrink-0 select-none font-semibold text-slate2">{numbered[1]}.</span>
        <span>{renderInline(numbered[2], lineKey)}</span>
      </span>
    );
  }
  // Plain text with inline formatting
  return <span key={lineKey}>{renderInline(line, lineKey)}</span>;
}

// ---- Tokeniser: split on LaTeX delimiters ----

function tokenize(input) {
  const tokens = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let last = 0, m;
  while ((m = re.exec(input)) !== null) {
    if (m.index > last) tokens.push({ type: 'text', text: input.slice(last, m.index) });
    if (m[1] != null) tokens.push({ type: 'block', tex: m[1] });
    else tokens.push({ type: 'inline', tex: m[2] });
    last = re.lastIndex;
  }
  if (last < input.length) tokens.push({ type: 'text', text: input.slice(last) });
  return tokens;
}

// ---- Main component ----

export default function MathText({ children, className = '' }) {
  const text = typeof children === 'string' ? children : '';
  const tokens = useMemo(() => tokenize(text), [text]);

  return (
    <span className={`${className} leading-relaxed`}>
      {tokens.map((t, ti) => {
        if (t.type !== 'text') return renderLatex(t, ti);
        // Split the text chunk into lines; render each with markdown
        const lines = t.text.split('\n');
        return lines.map((line, li) => {
          const isLast = li === lines.length - 1;
          const key = `${ti}-${li}`;
          return (
            <span key={key}>
              {renderLine(line, `l-${key}`)}
              {!isLast && <br />}
            </span>
          );
        });
      })}
    </span>
  );
}
