/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0F172A',   // Ton Bleu Nuit
        'secondary': '#3B82F6', // Ton Bleu Action
        'accent': '#F59E0B',    // Ton Ambre
        'surface': '#F8FAFC',   // Ton Gris de fond
        'success': '#10B981',   // Ton Vert
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}