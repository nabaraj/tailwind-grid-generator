/** @type {import('tailwindcss').Config} */
export default {
  // purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /grid-cols-./
    },
    {
      pattern: /border/
    },
    {
      pattern: /gap-/
    },
    { pattern: /row-span-/ },
    { pattern: /col-span-/ }
  ],
  content: [
    // Example content paths...
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx,vue}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
