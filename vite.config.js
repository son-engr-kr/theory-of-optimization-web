import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/theory-of-optimization-web/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate Plotly.js
          if (id.includes('plotly.js-dist-min')) {
            return 'plotly'
          }
          // Separate KaTeX
          if (id.includes('katex') || id.includes('react-katex')) {
            return 'katex'
          }
          // Separate React libraries
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor'
          }
          // Other node_modules libraries
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})