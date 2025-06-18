/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        times: ['"Times New Roman"', 'serif'],
        calibri: ['"Calibri"', 'serif']
      }
    },
  },
  plugins: [],
}

