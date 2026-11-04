import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: { main: resolve('index.html'), courses: resolve('courses/index.html'), error: resolve('404.html') },
    },
  },
});
