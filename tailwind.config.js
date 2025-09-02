/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#f6f7f9",
        border: "#e6e8eb",
        primary: "#ff7e1b",
        muted: "#6b7280",
        text: "#1f2937",
      }
    },
  },
  plugins: [],
};
