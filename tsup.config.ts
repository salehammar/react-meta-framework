import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  platform: 'node',
  target: 'node18',
  external: ['react', 'react-dom'],
  onSuccess: 'chmod +x dist/cli.js',
});
