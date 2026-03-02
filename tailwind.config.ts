import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        otj: {
          white: "hsl(var(--otj-white))",
          off: "hsl(var(--otj-off))",
          light: "hsl(var(--otj-light))",
          border: "hsl(var(--otj-border))",
          muted: "hsl(var(--otj-muted))",
          text: "hsl(var(--otj-text))",
          black: "hsl(var(--otj-black))",
          blue: "hsl(var(--otj-blue))",
          "blue-bg": "hsl(var(--otj-blue-bg))",
          "blue-border": "hsl(var(--otj-blue-border))",
          green: "hsl(var(--otj-green))",
          "green-bg": "hsl(var(--otj-green-bg))",
          "green-border": "hsl(var(--otj-green-border))",
          yellow: "hsl(var(--otj-yellow))",
          "yellow-bg": "hsl(var(--otj-yellow-bg))",
          "yellow-border": "hsl(var(--otj-yellow-border))",
          red: "hsl(var(--otj-red))",
          "red-bg": "hsl(var(--otj-red-bg))",
          orange: "hsl(var(--otj-orange))",
          "orange-bg": "hsl(var(--otj-orange-bg))",
          purple: "hsl(var(--otj-purple))",
          "purple-bg": "hsl(var(--otj-purple-bg))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
