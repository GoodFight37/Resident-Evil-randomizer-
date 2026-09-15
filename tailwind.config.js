/** @type {import('tailwind.config').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#9E7FFF',
        'primary-hover': '#8b63ff',
        secondary: '#38bdf8',
        accent: '#f472b6',
        background: '#0f0f14',
        surface: '#181824',
        'surface-card': '#1e1e2d',
        'surface-hover': '#262638',
        textMain: '#FFFFFF',
        textSecondary: '#94a3b8',
        borderDark: '#28283a',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(158, 127, 255, 0.25)',
        'glow-lg': '0 0 35px -5px rgba(158, 127, 255, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
      }
    },
  },
  plugins: [],
};
