import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Не забудьте установить @types/node

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      // Другие алиасы по желанию...
    },
  },
});