
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        ucl: {
          // UCL official colors
          purple: "#500778",       // Purple / Vibrant
          darkpurple: "#2C0442",   // Purple / Dark 
          mutedpurple: "#C6B0BC",  // Purple / Muted
          green: "#52C152",        // Green / Vibrant
          darkgreen: "#113B3A",    // Green / Dark
          mutedgreen: "#C9D1A8",   // Green / Muted
          blue: "#34C6C6",         // Blue / Vibrant
          darkblue: "#002248",     // Blue / Dark
          mutedblue: "#B6DCE5",    // Blue / Muted
          yellow: "#FFCA36",       // Yellow / Vibrant
          darkyellow: "#504D48",   // Yellow / Dark
          mutedyellow: "#DAD6CA",  // Yellow / Muted
          pink: "#AC145A",         // Pink / Vibrant
          darkpink: "#4B0A42",     // Pink / Dark
          mutedpink: "#DEB8C3",    // Pink / Muted
          black: "#000000",        // Black
          white: "#FFFFFF",        // White
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
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
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
