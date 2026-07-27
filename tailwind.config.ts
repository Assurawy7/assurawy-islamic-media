import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dynamic Primary Color don Admin Settings
        primary: "var(--primary-color)",

        // Core Assurawy palette
        ink: "#16261F",
        deep: "#0E3B2E",
        emerald: "#1C6B4F",
        emeraldLight: "#2E8564",
        gold: "#C6A15B",
        goldLight: "#E4CB8F",
        cream: "#F8F3E7",
        parchment: "#F1E9D8",
        sand: "#EFE6D3",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        arabic: ["var(--font-amiri)", "serif"],
      },
      backgroundImage: {
        "arabesque": "url('/arabesque.svg')",
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(14, 59, 46, 0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;