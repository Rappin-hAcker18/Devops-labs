import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Urban Dark Theme
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        neon: {
          cyan: '#00ffff',
          purple: '#8b5cf6',
          pink: '#ec4899',
          green: '#10b981',
          orange: '#f97316',
        },
        dark: {
          bg: {
            primary: '#0a0e1a',
            secondary: '#0f172a', 
            tertiary: '#1e293b',
            card: '#1e293b',
            elevated: '#334155',
          },
          text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
            muted: '#94a3b8',
            dim: '#64748b',
          },
          border: {
            primary: '#334155',
            secondary: '#475569',
            accent: '#2563eb',
          }
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'urban-gradient': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #d946ef 100%)',
        'neon-gradient': 'linear-gradient(135deg, #00ffff 0%, #8b5cf6 50%, #ec4899 100%)',
        'card-gradient': 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0a0e1a 0%, #1e293b 100%)',
        'hero-gradient': 'radial-gradient(ellipse at top, #1e40af 0%, #0a0e1a 50%, #4a044e 100%)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;