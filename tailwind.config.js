/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
 theme: {
  extend: {
    fontFamily: {
      sans: ['Geist', 'Helvetica Neue', 'Arial', 'sans-serif'],
      mono: ['Geist Mono', 'monospace']
    },
    colors: {
      background: '#f3fafe',
      foreground: '#1e293b',
      muted: '#64748b',
      accent: '#f59e0b'
    }
  }
},
  plugins: [],
};
