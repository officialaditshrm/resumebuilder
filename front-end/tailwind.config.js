/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

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
        ui: ['"Schibsted Grotesk"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        canvas: token('canvas'),
        sheet: token('sheet'),
        ink: token('ink'),
        graphite: token('graphite'),
        rule: token('rule'),
        edge: token('edge'),
        field: token('field'),
        'field-edge': token('field-edge'),
        wash: token('wash'),
        stop: token('stop'),
        danger: token('danger'),
        'on-ink': token('on-ink'),
      },
    },
  },
  plugins: [],
  darkMode : "class"
}
