/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "custom-size": "16px",
      },
      fontWeight: {
        "custom-weight": "400",
      },
      lineHeight: {
        "custom-line-height": "1.4",
      },
      fontFamily: {
        "custom-font": ["Noto Sans", "sans-serif"],
      },
      scale: {
        104: "1.04",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(to right, #2C3E50, #4CA1AF)",
      },
    },
  },
  variants: {
    extend: {
      scale: ["group-hover"],
      filter: ["group-hover"],
    },
  },
  plugins: [],
};
