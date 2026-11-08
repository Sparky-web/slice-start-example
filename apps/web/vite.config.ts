import { typoPlugin } from '@repo/vite-plugins'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 3010 },
  resolve: { tsconfigPaths: true },
  plugins: [
    typoPlugin(),
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
      router: {
        entry: './app/router.tsx',
        routesDirectory: './app/routes',
        generatedRouteTree: './app/routeTree.gen.ts',
      },
    }),
    react(),
  ],
})
