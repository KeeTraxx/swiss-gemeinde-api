import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import analyze from 'rollup-plugin-analyzer';
export default defineConfig({
  server: {
    port: 4200,
    proxy: {
      '/.netlify': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [svelte()],
  build: {
    rollupOptions: {
      plugins: [analyze({ summaryOnly: true })],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
