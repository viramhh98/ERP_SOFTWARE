import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Add this import

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add this to the plugins array
  ],
})
