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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        neutral: {
          900: '#0a0a0a',
          800: '#171717',
          700: '#262626',
          600: '#404040',
          500: '#737373',
          400: '#a3a3a3',
          300: '#d4d4d4',
        },
        orange: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
      },
    },
  },
  plugins: [],
}
export default config
