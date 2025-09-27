import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [react()],
    // Define global environment variables
    define: {
      'process.env.VITE_TMDB_API_KEY': JSON.stringify(env.VITE_TMDB_API_KEY || "227f8ae47b1c1df332b2e8aef9ef158f")
    },
    // Log environment presence (not the actual key) during build
    build: {
      rollupOptions: {
        onLog(level, log, handler) {
          if (level === 'info') {
            console.log(`Using environment variables: TMDB API Key ${env.VITE_TMDB_API_KEY ? 'is set' : 'is NOT set'}`);
          }
          handler(level, log);
        }
      }
    }
  }
})
