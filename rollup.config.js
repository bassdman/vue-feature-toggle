import { terser } from "rollup-plugin-terser";
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

const config = [{
    input: 'src/index.js',
    output: [{
        file: 'dist/vue-feature-toggle.js',
        format: "es",
        name: "FeatureToggleComponent",
        globals: {
            vue: 'vue'
        },
    }, {
        file: 'dist/vue-feature-toggle.umd.js',
        format: "umd",
        name: "FeatureToggleComponent",
        globals: {
            vue: 'vue'
        },
    }, {
        file: 'dist/vue-feature-toggle.umd.min.js',
        plugins: [terser()],
        format: "umd",
        globals: {
            vue: 'vue'
        },
        name: "FeatureToggleComponentWrapper",
        footer: 'var FeatureToggleComponent = FeatureToggleComponentWrapper.FeatureToggleComponent;',

    }],
    plugins: [resolve({ browser: true, resolveOnly: [/feature.*/] }), commonjs(), babel({
        presets: ['@babel/preset-env'],
        babelHelpers: 'bundled'
    })]
}];

export default config;