import assert from 'node:assert/strict';
import test from 'node:test';
import { isVNode, reactive } from 'vue';
import featureToggle, { Feature } from './index.js';

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