import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [react()],
    // Define global environment variables
    define: {
      'process.env.VITE_OMDB_API_KEY': JSON.stringify(env.VITE_OMDB_API_KEY || "b5b0b8ca")
    },
    // Log environment presence (not the actual key) during build
    build: {
      rollupOptions: {
        onLog(level, log, handler) {
          if (level === 'info') {
            console.log(`Using environment variables: OMDb API Key ${env.VITE_OMDB_API_KEY ? 'is set' : 'is NOT set'}`);
          }
          handler(level, log);
        }
      }
    }
  }
})
