import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        mist: "#f5f7fb",
        dusk: "#4f46e5",
        coral: "#f9735b",
        mint: "#14b8a6",
        pollen: "#f2b84b",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 42, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
