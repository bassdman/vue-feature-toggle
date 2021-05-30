import { terser } from "rollup-plugin-terser";
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

const config = {
    input: 'src/index.js',
    output: [{
        file: 'dist/vue-feature-toggle.js',
        format: "umd",
        name: "FeatureToggleComponent"
    }, {
        file: 'dist/vue-feature-toggle.min.js',
        plugins: [terser()],
        format: "umd",
        name: "FeatureToggleComponent"
    }, {
        file: 'dist/vue-feature-toggle.es5.js',
        format: "umd",
        name: "FeatureToggleComponentWrapper",
        footer: 'var FeatureToggleComponent = FeatureToggleComponentWrapper.FeatureToggleComponent;',
    }, {
        file: 'dist/vue-feature-toggle.es5.min.js',
        plugins: [terser()],
        format: "umd",
        name: "FeatureToggleComponentWrapper",
        footer: 'var FeatureToggleComponent = FeatureToggleComponentWrapper.FeatureToggleComponent;',

    }],
    plugins: [commonjs(), resolve({ browser: true }), babel({
        presets: ['@babel/preset-env'],
        babelHelpers: 'bundled'
    })]
};

export default config;