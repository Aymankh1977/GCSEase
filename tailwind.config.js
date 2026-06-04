/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        slate2: 'rgb(var(--c-slate2) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        accentSoft: 'rgb(var(--c-accentSoft) / <alpha-value>)',
        coral: 'rgb(var(--c-coral) / <alpha-value>)',
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
      },
      boxShadow: {
        card: '0 1px 0 rgb(var(--c-line)), 0 2px 8px rgba(0,0,0,0.05)',
        lift: '0 10px 30px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
