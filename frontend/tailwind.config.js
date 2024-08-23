import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      "light",
      "retro", 
      "black",
      "dark",
      "coffee",
      // Include the retro theme from DaisyUI
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "rgb(29, 155, 240)", // Customize the primary color
          secondary: "rgb(24, 24, 24)", // Customize the secondary color
        },
      },
    ],
  },
};
