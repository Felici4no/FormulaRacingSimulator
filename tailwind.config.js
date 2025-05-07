/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Exo 2"', 'sans-serif'],
      },
      colors: {
        'f1-red': '#e10600',
        'fe-green': '#14b868',
        'racing-black': '#121212',
        'racing-gray': '#2c2c2c',
      },
      animation: {
        'pulse-light': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};