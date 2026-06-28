/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./tugasp3.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}