const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      neutral: {
        text: "#414141",
        light: "#F4F6F7",
        dark: "#0A0C24",
      },
      white: colors.white,
      brand: {
        DEFAULT: "#2464F6",
        CTAHover: "#003CC5",
        accent: "#3A18AF",
      },
      danger: {
        DEFAULT: "#D3331D",
      },
      success: {
        DEFAULT: "#3EC84B",
      },
    },
    extend: {
      boxShadow: {
        largeCardShadow:
          "0px 4px 8px rgba(32, 48, 73, 0.1), 0px 18px 24px -12px rgba(12, 18, 65, 0.15);",
      },
      extend: {
        fontFamily: {
          basis: ["Basis Grotesque Pro", ...defaultTheme.fontFamily.sans],
        },
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
