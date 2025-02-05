/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}'
  ],

  safelist: [
    {
      pattern: /^grid-cols-\d+$/, // Matches grid-cols-1 to grid-cols-12+
      variants: ["sm", "md", "lg", "xl", "2xl"], // Adds responsive versions
    },
    {
      pattern: /^gap-\d+$/, // Matches gap-1, gap-2, gap-3, etc.
      variants: ["sm", "md", "lg", "xl", "hover"], // Adds responsive and hover support
    },
    {
      pattern: /^row-span-\d+$/, // Matches row-span-1, row-span-2, etc.
    },
    {
      pattern: /^col-span-\d+$/, // Matches col-span-1, col-span-2, etc.
    },
    {
      pattern: /^border$/, // Ensures border class is available
    }
  ],

  theme: { extend: {} },
  plugins: [],
};
