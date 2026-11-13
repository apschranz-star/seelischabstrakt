import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

/* The shop is served from the repository root (Netlify) and from /shop/ on
   GitHub Pages, so every URL in the build is relative. The build goes to a
   scratch folder; scripts/build.mjs copies index.html and app/ to the root. */
export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: '../.store-dist',
    emptyOutDir: true,
    assetsDir: 'app',
    target: 'es2022',
    cssCodeSplit: true,
    sourcemap: false,
    modulePreload: {polyfill: false},
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        entryFileNames: 'app/shop-[hash].js',
        chunkFileNames: 'app/[name]-[hash].js',
        assetFileNames: 'app/[name]-[hash][extname]',
      },
    },
  },
});
