module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lobster: ["Lobster", "cursive"],
      },
      backgroundImage: {
        "paper-pattern":
          "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url('/public/assets/backgrounds/paper_bg.jpg')",
        "pub-pattern":
          "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url('/public/assets/backgrounds/pub_bg.jpg')",
      },
      animation: {
        fade: "fadeIn 2s ease-in-out",
      },

      keyframes: () => ({
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      }),
    },
  },
  plugins: [],
};
