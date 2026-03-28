import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const config = defineConfig({
  server: {
    port: 4000,
  },
  plugins: [tailwindcss(), viteReact()],
  resolve: {
    tsconfigPaths: true,
  },
  base: './',
});

export default config;
