/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        felt: {
          DEFAULT: '#0F1B14',
          light: '#16261C',
          lighter: '#1E3327',
        },
        paper: {
          DEFAULT: '#FBF8F1',
          dim: '#F2EDE0',
        },
        ink: '#1C2620',
        brass: {
          DEFAULT: '#C9A227',
          light: '#E0BE4E',
          dim: '#9C7D1E',
        },
        entrada: {
          DEFAULT: '#2F6F4E',
          bg: '#E8F1EA',
        },
        salida: {
          DEFAULT: '#9B3B3B',
          bg: '#F5E9E9',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,38,32,0.06), 0 6px 20px rgba(28,38,32,0.08)',
        lift: '0 2px 4px rgba(28,38,32,0.08), 0 12px 28px rgba(28,38,32,0.14)',
      },
    },
  },
  plugins: [],
}
