import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aurel: {
          dark: '#08080a',
          card: '#111115',
          panel: '#15151a',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-gold': 'rgba(197, 160, 89, 0.25)',
          gold: '#c5a059',
          'gold-light': '#dfc285',
          'gold-dark': '#8c6e32',
          ivory: '#f5f2eb',
          'ivory-muted': '#a7a39a',
          subtle: '#22222a',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Didot', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
export default config;
