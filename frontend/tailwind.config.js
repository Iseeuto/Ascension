 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dragon: ["DragonHunter", "sans-serif"],
        vecna: ["Vecna", "sans-serif"],
        sigil: ["EbonSigil", "sans-serif"],
        varnyx: ["Varnyx", "sans-serif"],
        runavess: ["Runavess", "sans-serif"],
        firlest: ["Firlest", "sans-serif"],
        mirdane: ["Mirdane", "sans-serif"],
      },
    },
  },
  plugins: [],
};