/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0f',
          card: '#1a1a2e',
          border: '#2a2a3e',
        },
        neon: {
          pink: '#ff006e',
          blue: '#00f5ff',
          purple: '#b388ff',
          green: '#00ff88',
        }
      }
    },
  },
  plugins: [],
}