import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = parseInt(env.APP_PORT || '5173', 10);

  return {
    plugins: [react(), tailwindcss()],
    define: {
      DELCOM_BASEURL: JSON.stringify(
        env.DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1'
      ),
    },
    server: {
      port,
      host: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  };
});