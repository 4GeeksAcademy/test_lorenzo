/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sg-green': '#00473C',
        'sg-light-green': '#f4f3e7',
      },
    },
  },
  plugins: [],
}