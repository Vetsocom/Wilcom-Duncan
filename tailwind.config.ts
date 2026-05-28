import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#FFFFFF",
        midnight: "#000000",
        charcoal: "#080808",
        gold: {
          DEFAULT: "#E5E5E5",
          light: "#FFFFFF",
          dark: "#B8B8B8",
        },
        ivory: "#FFFFFF",
        copper: "#B8B8B8",
        slate: "#B8B8B8",
        emerald: "#E5E5E5",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
