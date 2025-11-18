import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: './',
    include: ['**/*.e2e-spec.ts'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 30000,
  },
  plugins: [swc.vite()],
});