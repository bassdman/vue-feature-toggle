import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript'; // Für die JS-Bundles
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';

export default defineConfig([{
    input: 'src/index.ts',
    output: [{
        file: 'dist/vue-feature-toggle.js',
        format: "esm",
        globals: {
            vue: 'vue'
        },
    }],
    plugins: []
},{
    input: 'src/index.ts',
    output: {
      file: 'dist/feature-toggle.d.ts',
      format: 'esm',
    },
    plugins: [
      dts(),
    ],
  }]);