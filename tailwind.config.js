module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
    },
    fontFamily: {
      sans: ['"Roboto"', 'sans-serif'],
      serif: ['"Merriweather"', 'serif'],
    }
  },
  plugins: [],
}