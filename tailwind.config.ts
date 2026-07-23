import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        slate: "rgb(var(--color-slate) / <alpha-value>)",
        mist: "rgb(var(--color-mist) / <alpha-value>)",
        cloud: "rgb(var(--color-cloud) / <alpha-value>)",
        dusk: "rgb(var(--color-dusk) / <alpha-value>)",
        coral: "rgb(var(--color-coral) / <alpha-value>)",
        mint: "rgb(var(--color-mint) / <alpha-value>)",
        pollen: "rgb(var(--color-pollen) / <alpha-value>)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)",
      },
      borderRadius: {
        tool: "8px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
