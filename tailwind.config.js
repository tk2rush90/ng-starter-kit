/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
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
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#b9e5fe",
          300: "#7cd1fd",
          400: "#36bbfa",
          500: "#0ca3eb",
          600: "#008dda", // Main.
          700: "#0167a3",
          800: "#065786",
          900: "#0b496f",
          950: "#072e4a",
        },
        secondary: {
          50: "#edfdfe",
          100: "#d2f6fb",
          200: "#abecf6",
          300: "#71ddef",
          400: "#41c9e2", // Main.
          500: "#15a8c5",
          600: "#1487a6",
          700: "#176c87",
          800: "#1c586e",
          900: "#1b4a5e",
          950: "#0c3040",
        },
        tertiary: {
          50: "#fbf7ef",
          100: "#f7eedd", // Main.
          200: "#e8cf9f",
          300: "#ddb16c",
          400: "#d49a4b",
          500: "#cb7d35",
          600: "#b3602c",
          700: "#954728",
          800: "#7a3a26",
          900: "#653022",
          950: "#39180f",
        },
        warn: {
          50: "#fffbeb",
          100: "#fff4c6",
          200: "#ffe888",
          300: "#fed64b",
          400: "#fec834", // Main.
          500: "#f8a208",
          600: "#dc7a03",
          700: "#b65507",
          800: "#94420c",
          900: "#79360e",
          950: "#461b02",
        },
        error: {
          50: "#fff1f1",
          100: "#ffe0e0",
          200: "#ffc5c5",
          300: "#ff9d9d",
          400: "#ff6565", // Main.
          500: "#fe2a2a",
          600: "#ec1616",
          700: "#c70e0e",
          800: "#a41010",
          900: "#881414",
          950: "#4a0505",
        },
        success: {
          50: "#f0fdf0",
          100: "#ddfbdd",
          200: "#bcf6bc",
          300: "#88ed89",
          400: "#3bd83e", // Main.
          500: "#25c229",
          600: "#18a11c",
          700: "#177e19",
          800: "#176419",
          900: "#155218",
          950: "#062d09",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
