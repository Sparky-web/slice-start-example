import { typoPlugin } from '@repo/vite-plugins'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [typoPlugin(), react(), tailwindcss()],
  // The polyfill is imported dynamically, so the dependency scan does not see it
  optimizeDeps: { include: ['@repo/lib > temporal-polyfill/global'] },
})
