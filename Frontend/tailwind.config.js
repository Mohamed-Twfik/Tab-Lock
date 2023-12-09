/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#BBD9E1",
        secondary: "#A7B1BD",
        accent: "#F2EEF8",
        dark: "#061D40",
    },
    fontFamily: {
      Georama: "Georama",
      Rancho: "Rancho",
    },
  },
  plugins: [],
}
}

