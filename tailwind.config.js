/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005825',
          hover: '#004a1f',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#005825',
          600: '#004a1f',
          700: '#003c19',
          800: '#002e13',
          900: '#00200d',
          950: '#001207',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#005825',
          600: '#005825',
          700: '#004a1f',
          800: '#003c19',
          900: '#00200d',
        },
        emerald: {
          500: '#005825',
          600: '#004a1f',
        },
        accent: {
          DEFAULT: '#ffd84d',
        },
        glass: {
          border: 'rgba(255, 255, 255, 0.5)',
          bg: 'rgba(255, 255, 255, 0.45)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
