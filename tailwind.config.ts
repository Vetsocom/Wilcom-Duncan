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
        background: "#05070D",
        foreground: "#F5EFE4",
        midnight: "#05070D",
        charcoal: "#080D16",
        gold: {
          DEFAULT: "#C99A3D",
          light: "#E2B95B",
          dark: "#A67A26",
        },
        ivory: "#F5EFE4",
        copper: "#A7653A",
        slate: "#A7AFBD",
        emerald: "#0F766E",
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
