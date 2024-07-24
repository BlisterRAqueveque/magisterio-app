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
    },
  },
  plugins: [],
};
