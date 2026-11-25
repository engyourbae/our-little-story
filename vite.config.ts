import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Untuk GitHub Pages project site, workflow mengisi VITE_BASE=/<nama-repo>/
const base = process.env.VITE_BASE || './';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'OUR LITTLE STORY',
        short_name: 'Our Little Story',
        description: 'A little world, made just for you.',
        theme_color: '#2f4a3a',
        background_color: '#1d2b26',
        display: 'standalone',
        orientation: 'any',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,woff2,json,glb,mp3,ogg,jpg,webp}'],
        navigateFallback: 'index.html',
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei']
        }
      }
    }
  }
});
