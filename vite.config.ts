import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: () => 'vue-feature-toggle.js',
        },
        sourcemap: true,
        rollupOptions: {
            external: ['vue', 'feature-toggle-api'],
            output: {
                exports: 'named',
            },
        },
    },
    plugins: [
        dts({
            entryRoot: resolve(import.meta.dirname, 'src'),
            outDirs: 'dist',
        }),
    ],
});