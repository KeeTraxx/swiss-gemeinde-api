import { defineConfig } from 'vite';
import elmPlugin from 'vite-plugin-elm';
import analyze from 'rollup-plugin-analyzer';
export default defineConfig({
  server: {
    proxy: {
      '/.netlify': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [elmPlugin()],
  build: {
    rollupOptions: {
      plugins: [analyze({ summaryOnly: true })],
    },
  },
});
