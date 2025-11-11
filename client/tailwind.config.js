/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skydeep: "#0f172a",   // deep night sky
        skyaqua: "#38bdf8",   // soft sky blue
        sandsun: "#fbbf24",   // warm accent
      },
      boxShadow: {
        card: "0 18px 50px rgba(15,23,42,0.45)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};