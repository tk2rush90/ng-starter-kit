import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', 'Noto Sans KR', 'Malgun Gothic', 'sans-serif'],
        mono: ['Source Code Pro', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
      },
      screens: {
        'xs': '375px',
        'sm': '425px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
      // Generate colors from https://uicolors.app/create is recommended.
      colors: {
        primary: colors.sky,
        secondary: colors.teal,
        tertiary: colors.violet,
        warn: colors.amber,
        error: colors.red,
        success: colors.emerald,
      },
      outlineWidth: {
        3: '3px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
