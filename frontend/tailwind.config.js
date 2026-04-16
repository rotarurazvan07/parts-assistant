/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#050505',
        'panel': '#0A0A0A',
        'border': '#262626',
        'text-primary': '#F5F5F5',
        'text-muted': '#808080',
        'primary': '#FFB000',
        'ai-accent': '#00FF41',
        'destructive': '#FF3B30',
        'hover': '#1A1A1A'
      },
      fontFamily: {
        'heading': ['IBM Plex Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}