import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#06110C",
        forest: "#103D2C",
        emerald: "#00A78B",
        gold: "#FFC107",
        ivory: "#FFF3D6",
        champagne: "#C8B88A",
        graphite: "#171717",
        alert: "#E5484D",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        brand: ["var(--font-cinzel)", "Georgia", "serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      maxWidth: { app: "1320px" },
      transitionTimingFunction: { premium: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};

export default config;
