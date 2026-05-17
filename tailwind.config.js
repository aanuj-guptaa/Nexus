/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#06060A',
          surface: '#0D0D14',
          elevated: '#13131D',
          card: '#16161F',
        },
        border: {
          DEFAULT: '#1E1E2E',
          subtle: '#16161F',
          hover: '#2A2A3F',
        },
        blue: {
          DEFAULT: '#3B82F6',
          bright: '#60A5FA',
          dim: '#1D4ED8',
          glow: 'rgba(59,130,246,0.15)',
        },
        text: {
          primary: '#F0F0FF',
          muted: '#6B7280',
          subtle: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        hero: ['Barlow', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'dot-pattern': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%231E1E2E'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
