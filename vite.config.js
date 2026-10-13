import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vue') || id.includes('node_modules/@vue')) {
            return 'vendor-vue';
          }
          if (id.includes('node_modules/lucide-vue-next')) {
            return 'vendor-icons';
          }
          if (id.includes('/src/data/seedData') || id.includes('/src/data/originalData.json')) {
            return 'seed-data';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
