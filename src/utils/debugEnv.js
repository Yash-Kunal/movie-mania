// This file helps debug environment variables in production
console.log('API Key Debug:');
console.log('VITE_OMDB_API_KEY exists:', !!import.meta.env.VITE_OMDB_API_KEY);
console.log('VITE_OMDB_API_KEY first 5 chars:', import.meta.env.VITE_OMDB_API_KEY ? import.meta.env.VITE_OMDB_API_KEY.substring(0, 5) + '...' : 'not available');

// Add this to your main.jsx to run at startup
export function debugApiKey() {
  console.log('API Key Debug from function:');
  console.log('VITE_OMDB_API_KEY exists:', !!import.meta.env.VITE_OMDB_API_KEY);
  console.log('VITE_OMDB_API_KEY first 5 chars:', import.meta.env.VITE_OMDB_API_KEY ? import.meta.env.VITE_OMDB_API_KEY.substring(0, 5) + '...' : 'not available');
}
