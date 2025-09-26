import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */

const animationGroups = {
  fade: [
    "in",
    "out",
    "in-down",
    "in-up",
    "in-left",
    "in-right",
    "out-down",
    "out-up",
    "out-left",
    "out-right",
    "out-top-left",
    "out-top-right",
  ],
  slide: [
    "in-down",
    "in-up",
    "in-left",
    "in-right",
    "out-down",
    "out-up",
    "out-left",
    "out-right",
    "down",
    "up",
    "left",
    "right",
  ],
  zoom: [
    "in",
    "in-up",
    "in-down",
    "in-left",
    "in-right",
    "out",
    "out-up",
    "out-down",
    "out-left",
    "out-right",
  ],
  flip: [
    "",
    "up",
    "down",
    "left",
    "right",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ],
};

const durations = ["1s", "2s", "3s", "5s"];
const infinites = [false, true];

function generateAnimations() {
  const animations = {};

  Object.entries(animationGroups).forEach(([groupName, variations]) => {
    variations.forEach((variation) => {
      durations.forEach((duration) => {
        infinites.forEach((isInfinite) => {
          const baseName = variation
            ? `${groupName}-${variation}`
            : `${groupName}`;
          const easing =
            baseName === "fade-out"
              ? "ease-out"
              : baseName === "fade-in-down"
                ? "ease-in"
                : "ease-in-out";
          const animationName = `${baseName}-${duration.replace("s", "")}${isInfinite ? "-infinite" : ""}`;
          animations[animationName] =
            `${baseName} ${duration} ${easing} ${isInfinite ? "infinite" : ""}`.trim();
        });
      });
    });
  });

  return animations;
}

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
        tremor: {
          brand: {
            faint: colors.blue[50],
            muted: colors.blue[200],
            subtle: colors.blue[400],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[700],
            inverted: colors.white,
          },
          background: {
            muted: colors.gray[50],
            subtle: colors.gray[100],
            DEFAULT: colors.white,
            emphasis: colors.gray[700],
          },
          border: {
            DEFAULT: colors.gray[200],
          },
          ring: {
            DEFAULT: colors.gray[200],
          },
          content: {
            subtle: colors.gray[400],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[700],
            strong: colors.gray[900],
            inverted: colors.white,
          },
        },
        "dark-tremor": {
          brand: {
            faint: "#0B1229",
            muted: colors.blue[950],
            subtle: colors.blue[800],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[400],
            inverted: colors.blue[950],
          },
          background: {
            muted: "#131A2B",
            subtle: colors.gray[800],
            DEFAULT: colors.gray[900],
            emphasis: colors.gray[300],
          },
          border: {
            DEFAULT: colors.gray[700],
          },
          ring: {
            DEFAULT: colors.gray[800],
          },
          content: {
            subtle: colors.gray[600],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[200],
            strong: colors.gray[50],
            inverted: colors.gray[950],
          },
        },
        boxShadow: {
          // light
          "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          "tremor-card":
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          "tremor-dropdown":
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          // dark
          "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          "dark-tremor-card":
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          "dark-tremor-dropdown":
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
        borderRadius: {
          "tremor-small": "0.375rem",
          "tremor-default": "0.5rem",
          "tremor-full": "9999px",
        },
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
        "automation-zoom-in": {
          "0%": { transform: "translateY(-30px) scale(0.2)" },
          "100%": { transform: "transform: translateY(0px) scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "fade-in-down": {
          "0%": { opacity: 0, transform: "translate3d(0, -100%, 0)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translate3d(0, 100%, 0)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "fade-in-left": {
          "0%": { opacity: 0, transform: "translate3d(-100%, 0, 0)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "fade-in-right": {
          "0%": { opacity: 0, transform: "translate3d(100%, 0, 0)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "fade-out-down": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0, transform: "translate3d(0, 100%, 0)" },
        },
        "fade-out-up": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0, transform: "translate3d(0, -100%, 0)" },
        },
        "fade-out-left": {
          "0%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
          "100%": { opacity: 0, transform: "translate3d(-100%, 0, 0)" },
        },
        "fade-out-right": {
          "0%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
          "100%": { opacity: 0, transform: "translate3d(100%, 0, 0)" },
        },
        "fade-out-top-left": {
          "0%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
          "100%": { opacity: 0, transform: "translate3d(-100%, -100%, 0)" },
        },
        "fade-out-top-right": {
          "0%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
          "100%": { opacity: 0, transform: "translate3d(100%, -100%, 0)" },
        },
        "slide-in-down": {
          "0%": {
            visibility: "visible",
            transform: "translate3d(0, -100%, 0)",
          },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        "slide-in-up": {
          "0%": { visibility: "visible", transform: "translate3d(0, 100%, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        "slide-in-left": {
          "0%": {
            visibility: "visible",
            transform: "translate3d(-100%, 0, 0)",
          },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        "slide-in-right": {
          "0%": { visibility: "visible", transform: "translate3d(100%, 0, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        "slide-out-down": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": {
            visibility: "hidden",
            transform: "translate3d(0, 100%, 0)",
          },
        },
        "slide-out-up": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": {
            visibility: "hidden",
            transform: "translate3d(0, -100%, 0)",
          },
        },
        "slide-out-left": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": {
            visibility: "hidden",
            transform: "translate3d(-100%, 0, 0)",
          },
        },
        "slide-out-right": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": {
            visibility: "hidden",
            transform: "translate3d(100%, 0, 0)",
          },
        },
        "slide-down": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(0, 100%, 0)" },
        },
        "slide-up": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(0, -100%, 0)" },
        },
        "slide-left": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-100%, 0, 0)" },
        },
        "slide-right": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(100%, 0, 0)" },
        },
        "zoom-in": {
          "0%": { opacity: 0, transform: "scale3d(0.3, 0.3, 0.3)" },
          "80%": { opacity: 0.8, transform: "scale3d(1.1, 1.1, 1.1)" },
          "100%": { opacity: 1, transform: "scale3d(1, 1, 1)" },
        },
        "zoom-in-up": {
          "0%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3) translate3d(0, 100%, 0)",
          },
          "80%": { opacity: 0.8, transform: "scale3d(1.1, 1.1, 1.1)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "zoom-in-down": {
          "0%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3) translate3d(0, -100%, 0)",
          },
          "80%": { opacity: 0.8, transform: "scale3d(1.1, 1.1, 1.1)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "zoom-in-left": {
          "0%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3) translate3d(-100%, 0, 0)",
          },
          "80%": { opacity: 0.8, transform: "scale3d(1.1, 1.1, 1.1)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "zoom-in-right": {
          "0%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3) translate3d(100%, 0, 0)",
          },
          "80%": { opacity: 0.8, transform: "scale3d(1.1, 1.1, 1.1)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "zoom-out": {
          "0%": { opacity: 1, transform: "scale3d(1, 1, 1)" },
          "15%": { opacity: 0.8, transform: "scale3d(1.1, 1.1, 1.1)" },
          "100%": { opacity: 0, transform: "scale3d(0.3, 0.3, 0.3)" },
        },
        "zoom-out-up": {
          "0%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
          "15%": { opacity: 0.8, transform: "scale3d(1.1, 1.1, 1.1)" },
          "100%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3) translate3d(0, -100%, 0)",
          },
        },
        "zoom-out-down": {
          "0%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
          "15%": { opacity: 0.8, transform: "scale3d(1.1, 1.1, 1.1)" },
          "100%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3) translate3d(0, 100%, 0)",
          },
        },
        "zoom-out-left": {
          "0%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
          "15%": { opacity: 0.8, transform: "scale3d(1.1, 1.1, 1.1)" },
          "100%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3) translate3d(-100%, 0, 0)",
          },
        },
        "zoom-out-right": {
          "0%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
          "15%": { opacity: 0.8, transform: "scale3d(1.1, 1.1, 1.1)" },
          "100%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3) translate3d(100%, 0, 0)",
          },
        },
        flip: {
          "0%": { transform: "rotateY(-180deg)" },
          "50%": { transform: "rotateY(-90deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        "flip-up": {
          "0%": { transform: "translate3d(0, 100%, 0) rotateY(-180deg)" },
          "50%": { transform: "rotateY(-90deg)" },
          "100%": { transform: "translate3d(0, 0, 0) rotateY(0deg)" },
        },
        "flip-down": {
          "0%": { transform: "translate3d(0, -100%, 0) rotateY(-180deg)" },
          "50%": { transform: "rotateY(-90deg)" },
          "100%": { transform: "translate3d(0, 0, 0) rotateY(0deg)" },
        },
        "flip-left": {
          "0%": { transform: "translate3d(-100%, 0, 0) rotateY(-180deg)" },
          "50%": { transform: "rotateY(-90deg)" },
          "100%": { transform: "translate3d(0, 0, 0) rotateY(0deg)" },
        },
        "flip-right": {
          "0%": { transform: "translate3d(100%, 0, 0) rotateY(-180deg)" },
          "50%": { transform: "rotateY(-90deg)" },
          "100%": { transform: "translate3d(0, 0, 0) rotateY(0deg)" },
        },
        "flip-top-left": {
          "0%": { transform: "translate3d(-100%, -100%, 0) rotateY(-180deg)" },
          "50%": { transform: "rotateY(-90deg)" },
          "100%": { transform: "translate3d(0, 0, 0) rotateY(0deg)" },
        },
        "flip-top-right": {
          "0%": { transform: "translate3d(100%, -100%, 0) rotateY(-180deg)" },
          "50%": { transform: "rotateY(-90deg)" },
          "100%": { transform: "translate3d(0, 0, 0) rotateY(0deg)" },
        },
        "flip-bottom-left": {
          "0%": { transform: "translate3d(-100%, 100%, 0) rotateY(-180deg)" },
          "50%": { transform: "rotateY(-90deg)" },
          "100%": { transform: "translate3d(0, 0, 0) rotateY(0deg)" },
        },
        "flip-bottom-right": {
          "0%": { transform: "translate3d(100%, 100%, 0) rotateY(-180deg)" },
          "50%": { transform: "rotateY(-90deg)" },
          "100%": { transform: "translate3d(0, 0, 0) rotateY(0deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "automation-zoom-in": "automation-zoom-in 0.5s",
        ...generateAnimations(),
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern: /animate-fade-.*/,
    },
    {
      pattern: /animate-slide-.*/,
    },
    {
      pattern: /animate-zoom-.*/,
    },
    {
      pattern: /animate-flip-.*/,
    },
  ],
  plugins: [],
};
