import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: 'index.html'
    }
  },
  test: {
    include: ['tests/unit/**/*.test.js']
  }
});