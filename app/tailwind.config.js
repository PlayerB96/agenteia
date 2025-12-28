/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#f1f5f9',
          dark: '#1e293b',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#0f172a',
        },
        text: {
          DEFAULT: '#0f172a',
          dark: '#e5e7eb',
        },
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#334155',
        },
      },
    },
  },

  plugins: [],
}
