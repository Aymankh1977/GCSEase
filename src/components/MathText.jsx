import { useMemo } from 'react';
import katex from 'katex';

// Renders a string that mixes plain text with LaTeX delimited by
// $...$ (inline) or $$...$$ (display). Falls back gracefully if KaTeX errors.
function renderToken(token, key) {
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

function tokenize(input) {
  const tokens = [];
  const regex = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let last = 0;
  let m;
  while ((m = regex.exec(input)) !== null) {
    if (m.index > last) tokens.push({ type: 'text', text: input.slice(last, m.index) });
    if (m[1] != null) tokens.push({ type: 'block', tex: m[1] });
    else tokens.push({ type: 'inline', tex: m[2] });
    last = regex.lastIndex;
  }
  if (last < input.length) tokens.push({ type: 'text', text: input.slice(last) });
  return tokens;
}

export default function MathText({ children, className = '' }) {
  const text = typeof children === 'string' ? children : '';
  const tokens = useMemo(() => tokenize(text), [text]);
  return (
    <span className={className}>
      {tokens.map((t, i) =>
        t.type === 'text'
          ? t.text.split('\n').map((line, j, arr) => (
              <span key={`${i}-${j}`}>
                {line}
                {j < arr.length - 1 ? <br /> : null}
              </span>
            ))
          : renderToken(t, i)
      )}
    </span>
  );
}
