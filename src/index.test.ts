import assert from 'node:assert/strict';
import test from 'node:test';
import { isVNode, reactive } from 'vue';
import feature from './index.js';

const featureComponent = feature as any;

test('exports the Vue 3 feature component', () => {
    assert.equal(featureComponent.name, 'feature');
    assert.equal(featureComponent.props.name.required, true);
    assert.equal(typeof featureComponent.setup, 'function');
});

test('updates visibility when reactive props change', () => {
    const props = reactive({
        name: 'vue3-hidden-test',
        variant: undefined,
        data: undefined,
        tag: '',
    });
    const render = featureComponent.setup(props, { slots: { default: () => ['visible'] } });

    feature.setFlag('vue3-hidden-test', false);
    feature.setFlag('vue3-visible-test', true);
    assert.equal(render(), null);

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

    feature.setFlag('hidden-vue3-test', false);
    assert.equal(render(), null);
});

test('renders a tagged feature as a Vue 3 VNode', () => {
    const render = featureComponent.setup({
        name: 'tagged-vue3-test',
        variant: 'new',
        data: undefined,
        tag: 'section',
    }, { slots: { default: () => ['visible'] } });

    feature.setFlag('tagged-vue3-test', 'new', true);
    const rendered = render();

    assert.equal(isVNode(rendered), true);
    assert.equal(rendered.type, 'section');
    assert.equal(rendered.props['feature-name'], 'tagged-vue3-test');
    assert.equal(rendered.props['feature-variant'], 'new');
});