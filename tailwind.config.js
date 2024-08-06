/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        16: "repeat(16, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-14": "span 14 / span 14",
      },
      colors: {
        mag: {
          50: "#fffbea",
          100: "#fff1c5",
          200: "#ffe485",
          300: "#ffcf46",
          400: "#ffb91b",
          500: "#fa9200",
          600: "#e26e00",
          700: "#bb4a02",
          800: "#983908",
          900: "#7c2f0b",
          950: "#481600",
        },
      },
    },
  },
  plugins: [],
};
