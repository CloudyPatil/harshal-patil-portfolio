/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // <--- UPDATED PATH (Removed src/)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cyber: ['var(--font-orbitron)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        'neon-cyan': '#00f3ff',
        'neon-pink': '#ff003c',
        'neon-green': '#0aff00',
        'void-black': '#050505',
      },
    },
  },
  plugins: [],
};