
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgb(39, 39, 42)",
        input: "rgb(39, 39, 42)",
        ring: "rgb(161, 161, 170)",
        background: "#09090b",
        foreground: "rgb(244, 244, 245)",
        primary: {
          DEFAULT: "rgb(147, 112, 219)",
          foreground: "rgb(250, 250, 250)",
        },
        secondary: {
          DEFAULT: "rgb(34, 34, 37)",
          foreground: "rgb(250, 250, 250)",
        },
        destructive: {
          DEFAULT: "rgb(239, 68, 68)",
          foreground: "rgb(250, 250, 250)",
        },
        muted: {
          DEFAULT: "rgb(39, 39, 42)",
          foreground: "rgb(161, 161, 170)",
        },
        accent: {
          DEFAULT: "rgb(34, 34, 37)",
          foreground: "rgb(250, 250, 250)",
        },
        popover: {
          DEFAULT: "rgb(24, 24, 27)",
          foreground: "rgb(244, 244, 245)",
        },
        card: {
          DEFAULT: "rgb(24, 24, 27)",
          foreground: "rgb(244, 244, 245)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(8px)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "fade-out": "fade-out 0.3s ease-out forwards",
        "scale-in": "scale-in 0.2s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
