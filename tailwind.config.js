/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: '#FAF6EC',
        ink: '#16202B',
        slate2: '#465563',
        line: '#D9D0BE',
        accent: '#1F8A4C',
        accentSoft: '#E2F0E5',
        coral: '#E8623A',
        gold: '#E0A526',
      },
      boxShadow: {
        card: '0 1px 0 #D9D0BE, 0 2px 8px rgba(22,32,43,0.05)',
        lift: '0 10px 30px rgba(22,32,43,0.10)',
      },
    },
  },
  plugins: [],
}
