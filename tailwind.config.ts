import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Assurawy palette — named, not generic "primary/secondary"
        ink: "#16261F", // near-black, green-tinted body text
        deep: "#0E3B2E", // deep emerald — headers, nav, footer
        emerald: "#1C6B4F", // mid emerald — buttons, links, accents
        emeraldLight: "#2E8564",
        gold: "#C6A15B", // muted gold — never bright yellow
        goldLight: "#E4CB8F",
        cream: "#F8F3E7", // warm background
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
