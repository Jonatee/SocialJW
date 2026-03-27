/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
    "./stores/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#F7F9FB",
        panel: "#FFFFFF",
        ink: "#1A1A1A",
        muted: "#6B7280",
        accent: "#3B82F6",
        accentDark: "#1E3A5F",
        border: "#D9E2EC",
        success: "#10B981",
        gold: "#D4AF37"
      },
      boxShadow: {
        card: "0 20px 45px rgba(30, 58, 95, 0.10)"
      },
      fontFamily: {
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
