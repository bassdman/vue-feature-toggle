import { computed, defineComponent, h, ref } from 'vue';
import {useFeatureToggle} from 'feature-toggle-api';

export const featureToggle = useFeatureToggle();
const visibilityRevision = ref(0);

featureToggle.on('visibilityrule', () => {
    visibilityRevision.value += 1;
}, { ignorePreviousRules: true });

export const Feature = defineComponent({
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
            type: [Object, String]
        },
        tag: {
            type: String,
            default: ''
        }
    },
    setup(props, { slots }) {
        const isVisible = computed(() => {
            // Let Vue know that the computed value depends on feature rule changes.
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

export default featureToggle;