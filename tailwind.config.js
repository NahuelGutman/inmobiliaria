/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#2C221E",       // texto principal, casi negro con base verde
        paper: "#F3EFEA",     // fondo cálido
        forest: "#8C6D58",    // color principal de marca (verde profundo)
        forestLight: "#9C7F6A",
        brass: "#B08D57",     // acento cálido (dorado apagado)
        stone: "#EADFCF",     // bordes / superficies suaves
        slate: "#B3A69A",     // texto secundario
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
