/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "dark-red": "#BF1717",
        "custom-green": "#83A300",
        "custom-gray": "#D9D9D9"
      },
      screens: {
        xl: "1280px"
      }
    },
  },
  plugins: [],
}

