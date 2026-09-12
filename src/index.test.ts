import assert from 'node:assert/strict';
import test from 'node:test';
import { createSSRApp, h, isVNode, reactive } from 'vue';
import { renderToString } from '@vue/server-renderer';
import featureToggle, { createFeatureToggle, Feature } from './index.js';

const featureComponent = Feature as any;

test('exports the Vue 3 feature component', () => {
    assert.equal(featureComponent.name, 'Feature');
    assert.equal(featureComponent.props.name.required, true);
    assert.equal(typeof featureComponent.setup, 'function');
});

test('updates visibility when feature flags or reactive props change', () => {
    const props = reactive({
        name: 'vue3-hidden-test',
        variant: undefined,
        data: undefined,
        tag: '',
    });
    const render = featureComponent.setup(props, { slots: { default: () => ['visible'] } });

    featureToggle.setFlag('vue3-hidden-test', false);
    assert.equal(render(), null);

    featureToggle.setFlag('vue3-hidden-test', true);
    assert.deepEqual(render(), ['visible']);

    featureToggle.setFlag('vue3-visible-test', true);
    props.name = 'vue3-visible-test';
    assert.deepEqual(render(), ['visible']);
});

test('renders null for an inactive feature', () => {
    const render = featureComponent.setup({
        name: 'hidden-vue3-test',
        variant: undefined,
        data: undefined,
        tag: '',
    }, { slots: { default: () => ['hidden'] } });

    featureToggle.setFlag('hidden-vue3-test', false);
    assert.equal(render(), null);
});

test('renders a tagged feature as a Vue 3 VNode', () => {
    const render = featureComponent.setup({
        name: 'tagged-vue3-test',
        variant: 'new',
        data: undefined,
        tag: 'section',
    }, { slots: { default: () => ['visible'] } });

    featureToggle.setFlag('tagged-vue3-test', 'new', true);
    const rendered = render();

    assert.equal(isVNode(rendered), true);
    assert.equal(rendered.type, 'section');
    assert.equal(rendered.props['feature-name'], 'tagged-vue3-test');
    assert.equal(rendered.props['feature-variant'], 'new');
});

test('renders the component through a real Vue 3 app', async () => {
    featureToggle.setFlag('mounted-vue3-test', true);
    const app = createSSRApp({
        render: () => h(Feature, { name: 'mounted-vue3-test' }, {
            default: () => 'mounted content'
        })
    });

    assert.match(await renderToString(app), /mounted content/);
});

test('creates isolated API and component instances', () => {
    const first = createFeatureToggle({ isolatedFirst: true });
    const second = createFeatureToggle({ isolatedSecond: true });

    assert.equal(first.featureToggle.isActive('isolatedFirst'), true);
    assert.equal(first.featureToggle.isActive('isolatedSecond'), false);
    assert.equal(second.featureToggle.isActive('isolatedFirst'), false);
    assert.equal(second.featureToggle.isActive('isolatedSecond'), true);
    assert.notEqual(first.featureToggle, second.featureToggle);
    assert.notEqual(first.Feature, second.Feature);
});

test('accepts arbitrary data values', () => {
    const props = reactive({
        name: 'arbitrary-data-test',
        variant: undefined,
        data: 42,
        tag: ''
    });
    const render = Feature.setup!(props as never, { slots: { default: () => ['visible'] } } as never);

    featureToggle.setFlag('arbitrary-data-test', (_,) => true);
    assert.deepEqual(render(), ['visible']);
});