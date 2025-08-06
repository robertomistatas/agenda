/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#184347',
        accent: '#9BE4D2',
        background: '#F2EAE2',
        'glass-bg': 'rgba(255, 255, 255, 0.25)',
        'glass-border': 'rgba(255, 255, 255, 0.18)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontFamily: {
        'corporate': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
