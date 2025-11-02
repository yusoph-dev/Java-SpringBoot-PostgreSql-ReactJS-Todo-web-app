import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.VITE_PORT) || 3000,
    host: process.env.VITE_HOST || '0.0.0.0'
  },
  envPrefix: 'VITE_'
})
