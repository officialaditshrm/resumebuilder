/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        timesa: ['TimesNewRomanCustom', 'serif'],
        tinos: ['Tinos', 'serif'],
      }
    },
  },
  plugins: [],
  darkMode : "class"
}

