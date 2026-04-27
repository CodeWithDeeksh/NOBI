/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      colors: {
        nobi: {
          primary: '#7c3aed',
          bg: '#ede9fe',
          success: '#d1fae5',
          warning: '#fef3c7',
          alert: '#fee2e2',
        }
      }
    },
  },
  plugins: [],
}
