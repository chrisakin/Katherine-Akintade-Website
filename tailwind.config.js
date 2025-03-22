/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mint: '#d6f6dd',
        'mint-light': '#e8faea',
        sky: '#c7eeff',
        'sky-light': '#e1f6ff',
        coral: '#ffaeae',
        'coral-light': '#ffd6d6',
      },
    },
  },
  plugins: [],
};