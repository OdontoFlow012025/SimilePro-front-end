import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "background-light": "var(--background)", // Keep for back-compat or refactor
        "background-dark": "var(--background)",  // simplified to single var
        "surface-light": "var(--surface)",
        "surface-dark": "var(--surface)",
        "text-main": "var(--text-main)",
        "text-secondary": "var(--text-secondary)",
        "accent-green": "var(--accent-green)",
        // Semantic aliases
        "background": "var(--background)",
        "foreground": "var(--foreground)",
        "surface": "var(--surface)",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
};
export default config;
