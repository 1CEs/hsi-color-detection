/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hue-gradient': 'linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))',
      },
      colors: {
        ...{
          primary: {
            DEFAULT: "#FF5722"
          },
          secondary: {
            DEFAULT: "#FD7014"
          },
          background: {
            DEFAULT: "#01040c",
            50: "#00040c"
          },
          foreground: {
            DEFAULT: "#EEE"
          }
        }
      },
    },
  },
  plugins: [],
}

