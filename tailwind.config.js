/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Зеленая тема
        green: {
          primary: "#064e3b",
          secondary: "#065f46",
          accent: "#047857",
          bg: {
            DEFAULT: "#f8fafc",
            lighter: "#f1f5f9",
            darker: "#e2e8f0",
          },
        },
        // Синяя тема
        blue: {
          primary: "#1e40af",
          secondary: "#1e3a8a",
          accent: "#2563eb",
          bg: {
            DEFAULT: "#0f172a",
            lighter: "#1e293b",
            darker: "#020617",
          },
        },
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}