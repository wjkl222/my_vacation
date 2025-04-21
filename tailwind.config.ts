import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      fontFamily: {
        sans: ["var(--font-main)", ...fontFamily.sans],
      },
      spacing: {
        navbar: "var(--nav-height)",
      },
      height: {
        "screen-navbar": "calc(100svh - var(--nav-height))",
      },
      minHeight: {
        "screen-navbar": "calc(100svh - var(--nav-height))",
      },
      colors: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(0 0% 12%)",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(225, 94%, 67%)",
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "#fff",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsla(0, 0%, 12%, 0.4)",
          foreground: "hsla(222, 47%, 11%, 0.4)",
        },
        accent: {
          DEFAULT: "#00AEAB",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsla(0, 0%, 96%, 1)",
        input: "hsl(0, 0%, 96%)",
        ring: "hsl(20 14.3% 4.1%)",
        navbar: "hsla(300, 1%, 13%, 1)",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
