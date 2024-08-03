/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-', // Ajoutez ce préfixe pour éviter les conflits avec Bootstrap
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}