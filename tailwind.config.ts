import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pelak: ["var(--font-pelak)"],
        "pelak-bold": ["var(--font-pelak-extra-bold)"],
      },
    },
    screens: {
      mobile: "320px",
      tablet: "720px",
      md: "1024px",
      lg: "1260px",
      xl: "1440px",
    },
  },

  plugins: [],
};

export default config;
