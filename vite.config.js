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
        reporter: ['text', 'json', 'html', 'lcov'],
        // Semua file sumber (js + jsx) ikut dihitung, sama seperti yang dilihat Sonar.
        include: ['src/**/*.{js,jsx}'],
        exclude: [
          'src/**/*.test.{js,jsx}',
          'src/__tests__/**',
          'src/main.jsx',
          'src/setupTests.js',
          'src/test-utils.jsx',
        ],
        // Threshold sengaja tidak dipasang di sini: gerbang 80% sudah dijaga
        // oleh SonarQube Quality Gate, dan threshold vitest bisa membuat
        // stage Test gagal sebelum sampai ke Sonar.
      },
    },
  };
});