/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      colors: {
        brand: {
          50:"#eef6ff",100:"#d9eaff",200:"#b9d8ff",300:"#8fc0ff",
          400:"#5aa0ff",500:"#327fff",600:"#1f63ec",700:"#174ec0",800:"#173f96",900:"#163876"
        }
      },
      borderRadius:{ xl:"0.75rem","2xl":"1rem" }
    }
  },
  plugins: [],
};