/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#171717',
        primary: '#39ff14', // neon green
        primaryHover: '#32e011',
        text: '#f3f4f6', // gray-100
        textMuted: '#9ca3af', // gray-400
        border: '#262626', // neutral-800
      }
    },
  },
  plugins: [],
}
