/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./gallery.html",
    "./scripts/**/*.js",
  ],
  safelist: [
    'bg-brand-green',
    'hover:bg-brand-green-dark',
    'text-brand-neon',
    'bg-brand-yellow',
    'hover:bg-brand-yellow-dark',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            DEFAULT: '#22c55e',
            dark: '#16a34a',
            neon: '#00ff66',
          },
          yellow: {
            DEFAULT: '#facc15',
            dark: '#eab308',
          },
        },
        background: '#0a0a0a',
      },
    },
  },
  plugins: [],
}