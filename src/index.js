import featureToggleApi from 'feature-toggle-api';
import * as vue from 'vue';

const FeatureToggleComponent = new featureToggleApi();

function getDefaultSlot(slot) {
    // in vue3, slot is a function
    if (typeof slot == 'function')
        return slot();

    //in vue <= 2 slot can be directly accessed.
    return slot;
}

function vuePlugin(api) {
    Object.assign(api, {
        props: {
            name: {
                type: String
            },
            variant: {
                type: String
            },
            data: {
                type: [Object, String]
            },
            tag: {
                type: String,
                default: 'div'
            }
        },
        name: 'feature',
        data() {
            return {
                isVisible: api.isVisible(this.name, this.variant, this.data)
            }
        },
        render: function(createElement) {
            if (!this.isVisible)
                return;

            // fix for vue3: h is imported instead of passed by the render function
            const create = vue.h || createElement;
            return create(this.tag, {
                'feature-name': this.name,
                'feature-variant': this.variant
            }, getDefaultSlot(this.$slots.default))
        },
        methods: {
            _isVisible: function(name, variant, data) {
                return api.isVisible(name, variant, data);
            }
        }
    })
}

FeatureToggleComponent.addPlugin(vuePlugin);

export {
    FeatureToggleComponent
}