import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0C14',
          secondary: '#0F1320',
          card: '#141824',
          elevated: '#1A1F30',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C96B',
          dark: '#9A7A35',
          muted: '#6B5A2A',
        },
        ink: {
          primary: '#E8E6E0',
          secondary: '#A8A49C',
          muted: '#6B6760',
        },
        wealth: {
          high: '#4ADE80',
          mid: '#FACC15',
          low: '#FB923C',
          danger: '#F87171',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C96B 50%, #C9A84C 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0C14 0%, #0F1320 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(20,24,36,0) 60%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,168,76,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(201,168,76,0.4)' },
        },
      },
      borderColor: {
        gold: {
          DEFAULT: 'rgba(201,168,76,0.3)',
          bright: 'rgba(201,168,76,0.6)',
          subtle: 'rgba(201,168,76,0.12)',
        },
      },
    },
  },
  plugins: [],
}

export default config
