/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          light: '#fcefe9',
          DEFAULT: '#f97316', // Tailwind orange-500
          dark: '#c2410c'
        },
        ocean: {
          light: '#e0f7fa',
          DEFAULT: '#00bcd4',
          dark: '#008394',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 14px rgba(0, 0, 0, 0.08)',
        header: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

