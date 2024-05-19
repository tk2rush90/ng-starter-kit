/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        xs: "375px",
        sm: "425px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
      // Generate colors from https://uicolors.app/create is recommended.
      colors: {
        primary: {
          50: "#f1fcf4",
          100: "#dff9e8",
          200: "#c1f1d2",
          300: "#90e5af",
          400: "#58d083",
          500: "#32b561",
          600: "#23964d",
          700: "#1f7640",
          800: "#1e5d36",
          900: "#1a4d2e",
          950: "#092a17",
        },
        secondary: {
          50: "#f3f6f3",
          100: "#e2eae1",
          200: "#c5d5c5",
          300: "#9eb79f",
          400: "#749376",
          500: "#749376",
          600: "#3f5c42",
          700: "#324a35",
          800: "#2a3b2c",
          900: "#233125",
          950: "#131b14",
        },
        tertiary: {
          50: "#faf7f2",
          100: "#f2eee2",
          200: "#e8dfca",
          300: "#d4c29d",
          400: "#c2a575",
          500: "#b58e5a",
          600: "#a87c4e",
          700: "#8c6442",
          800: "#71513b",
          900: "#5c4332",
          950: "#312219",
        },
      },
    },
  },
  plugins: [],
};
