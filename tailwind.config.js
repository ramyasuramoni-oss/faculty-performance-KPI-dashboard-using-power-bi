/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        powerbi: {
          yellow: '#F2C811',
          gold: '#D9A404',
          dark: '#1F1F1F',
          sidebar: '#111827',
          card: '#1E293B',
          accent: '#2563EB',
          teal: '#0D9488',
          emerald: '#059669',
          amber: '#D97706',
          rose: '#E11D48',
        }
      }
    },
  },
  plugins: [],
}
