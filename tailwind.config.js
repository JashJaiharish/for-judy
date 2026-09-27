/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#050505',
        gold: '#D4AF37',
        goldbright: '#F5D76E',
        cream: '#F8F5ED',
        wine: '#5A0F14',
      },
      fontFamily: {
        script: ['"Great Vibes"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'sans-serif'],
      },
      letterSpacing: {
        wide2: '0.35em',
        wide3: '0.5em',
      },
    },
  },
  plugins: [],
}
