/** @type {import('tailwindcss').Config} */
export default {

  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {

    extend: {

      /* =========================================
         PREMIUM SHADOW SYSTEM
      ========================================= */

      boxShadow: {

        soft: "0 2px 8px rgb(15 23 42 / 0.06)",

        card: `
          0 4px 6px -1px rgb(15 23 42 / 0.05),
          0 10px 15px -3px rgb(15 23 42 / 0.08)
        `,

        glow: "0 0 0 3px rgb(var(--color-primary) / 0.15)",

        "glow-lg": "0 10px 30px rgb(var(--color-primary) / 0.25)",

      },


      /* =========================================
         PREMIUM ANIMATIONS
      ========================================= */

      animation: {

        fadeIn: "fadeIn 0.4s ease-out",

        slideUp: "slideUp 0.4s ease-out",

        float: "float 6s ease-in-out infinite",

      },


      keyframes: {

        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },

        slideUp: {
          "0%": {
            opacity: 0,
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },

        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },

      },


      /* =========================================
         BETTER BORDER RADIUS SYSTEM
      ========================================= */

      borderRadius: {

        xl2: "1.25rem",

        xl3: "1.5rem",

      },


      /* =========================================
         BETTER BREAKPOINT FOR LARGE SCREENS
      ========================================= */

      screens: {

        xs: "480px",

      },

    },

  },

  plugins: [],

};