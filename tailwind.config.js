/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",        // texto principal / negro de marca
        paper: "#F5F5F3",      // fondo claro
        forest: "#111111",     // color principal de marca (botones, footer) -> negro
        forestLight: "#333333",
        brass: "#6E6E6A",      // etiquetas pequeñas
        stone: "#E2E2DE",      // bordes / superficies suaves
        slate: "#5F5F5B",      // texto secundario
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
