/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       sans: [
  //         "Inter var",
  //         "-apple-system",
  //         "BlinkMacSystemFont",
  //         "Segoe UI",
  //         "Roboto",
  //         "Helvetica",
  //         "Arial",
  //         "sans-serif",
  //         "Apple Color Emoji",
  //         "Segoe UI Emoji",
  //         "Segoe UI Symbol",
  //       ],
  //     },
  //     //darkMode: ["selector", '[data-mode="dark-theme"]'], // dark-theme class
  //   },
  // },
  plugins: [require("tailwindcss-primeui")], // Needed to work with PrimeNG
};
