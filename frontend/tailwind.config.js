/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        available: "#22c55e",
        occupied: "#ef4444",
        designated: "#3b82f6",
        flooder: "#eab308",
      },
    },
  },
  plugins: [],
};
