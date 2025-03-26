/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../stories/**/*.{js,ts,jsx,tsx,mdx}',
    '../components/**/*.{js,ts,jsx,tsx,mdx}',
    '../app/**/*.{js,ts,jsx,tsx,mdx}',
    './**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [require('../tailwind.config.ts')],
};
