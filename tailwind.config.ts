import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Core Brand Colors - "Investor Confidence" Palette
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        
        // Design System Colors
        navy: {
          50: '#f8fafc',
          900: '#0a0f1c', // Deep Navy - Authority, trust, depth
        },
        electric: {
          500: '#2563eb', // Electric Blue - Innovation, AI intelligence
        },
        
        // Semantic Colors
        success: '#10b981', // Success Green - Completion, growth
        warning: '#f59e0b', // Warning Amber - Attention, review needed
        neutral: '#64748b', // Warm Gray - Professional neutrality
        
        // Template-Specific Accents
        template: {
          a: {
            from: '#2563eb', // Electric Blue
            to: '#7c3aed',   // Deep Purple
          },
          b: {
            primary: '#dc2626', // Strategic Red
          },
          c: {
            from: '#f59e0b', // Warm Gold
            to: '#ea580c',   // Deep Orange
          },
          d: {
            from: '#059669', // Forest Green
            to: '#0d9488',   // Teal
          },
        },
      },
      fontFamily: {
        // Primary: Inter for web interfaces
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Presentation: Source Sans Pro for PDF exports
        presentation: ['Source Sans Pro', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography Hierarchy from Design System
        'display': ['72px', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['40px', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        'button': ['16px', { lineHeight: '1', fontWeight: '500' }],
      },
      spacing: {
        // 24px grid system
        'grid': '24px',
      },
      maxWidth: {
        'content': '1200px',
      },
      animation: {
        // Micro-animations
        'slide-up': 'slideUp 200ms ease-out',
        'bounce-in': 'bounce 300ms ease-out',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
      boxShadow: {
        // Depth system from design guide
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'floating': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'glass': '20px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config 