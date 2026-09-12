import { computed, defineComponent, h } from 'vue';
import {useFeatureToggle, type FeatureToggleApi} from 'feature-toggle-api';

const featureToggle = useFeatureToggle();

function vuePlugin(api: FeatureToggleApi): Partial<FeatureToggleApi> {
    return defineComponent({
        props: {
            name: {
                type: String,
                required: true
            },
            variant: {
                type: String
            },
            data: {
                type: [Object, String]
            },
            tag: {
                type: String,
                default: ''
            }
        },
        name: 'feature',
        setup(props, { slots }) {
            const isVisible = computed(() => api.isActive(props.name, props.variant, props.data));

            return () => {
                if (!isVisible.value)
                    return null;

                if (props.tag) {
                    return h(props.tag, {
                        'feature-name': props.name,
                        'feature-variant': props.variant
                    }, slots.default?.());
                }
                return slots.default?.() ?? null;
            };
        }
    }) as unknown as Partial<FeatureToggleApi>;
}

featureToggle.addPlugin(vuePlugin);
export default featureToggle;