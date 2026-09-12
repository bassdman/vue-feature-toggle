import { computed, defineComponent, h, ref, type PropType } from 'vue';
import { useFeatureToggle, type FeatureToggleConfig } from 'feature-toggle-api';

export function createFeatureToggle(config: FeatureToggleConfig = {}) {
    const featureToggle = useFeatureToggle(config);
    const visibilityRevision = ref(0);

    featureToggle.on('visibilityrule', () => {
        visibilityRevision.value += 1;
    }, { ignorePreviousRules: true });

    const Feature = defineComponent({
        name: 'Feature',
        props: {
            name: {
                type: String,
                required: true
            },
            variant: {
                type: String
            },
            data: {
                type: null as unknown as PropType<unknown>
            },
            tag: {
                type: String,
                default: ''
            }
        },
        setup(props, { slots }) {
            const isVisible = computed(() => {
                visibilityRevision.value;
                return featureToggle.isActive(props.name, props.variant, props.data);
            });

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
    });

    return { featureToggle, Feature };
}

const defaultInstance = createFeatureToggle();
export const featureToggle = defaultInstance.featureToggle;
export const Feature = defaultInstance.Feature;
export default featureToggle;