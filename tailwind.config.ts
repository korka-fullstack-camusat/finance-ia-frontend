import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       "#F8FAFC",
        surface:  "#FFFFFF",
        surface2: "#F1F5F9",
        border:   "#E2E8F0",
        accent:   "#2563EB",
        "accent-light": "#EFF6FF",
        muted:    "#64748B",
        subtle:   "#94A3B8",
      },
      animation: {
        fadeIn:  "fadeIn 0.25s ease-out forwards",
        slideIn: "slideIn 0.3s ease-out forwards",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0", transform: "translateY(6px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideIn: { "0%": { opacity: "0", transform: "translateX(12px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
