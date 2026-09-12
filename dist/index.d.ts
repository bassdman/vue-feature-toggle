import { PropType } from 'vue';
import { FeatureToggleConfig } from 'feature-toggle-api';
export declare function createFeatureToggle(config?: FeatureToggleConfig): {
    featureToggle: import('feature-toggle-api').FeatureToggleApi;
    Feature: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
        name: {
            type: StringConstructor;
            required: true;
        };
        variant: {
            type: StringConstructor;
        };
        data: {
            type: PropType<unknown>;
        };
        tag: {
            type: StringConstructor;
            default: string;
        };
    }>, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }> | import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }>[], {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
        name: {
            type: StringConstructor;
            required: true;
        };
        variant: {
            type: StringConstructor;
        };
        data: {
            type: PropType<unknown>;
        };
        tag: {
            type: StringConstructor;
            default: string;
        };
    }>> & Readonly<{}>, {
        tag: string;
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
};
export declare const featureToggle: import('feature-toggle-api').FeatureToggleApi;
export declare const Feature: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    name: {
        type: StringConstructor;
        required: true;
    };
    variant: {
        type: StringConstructor;
    };
    data: {
        type: PropType<unknown>;
    };
    tag: {
        type: StringConstructor;
        default: string;
    };
}>, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
    [key: string]: any;
}> | import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    name: {
        type: StringConstructor;
        required: true;
    };
    variant: {
        type: StringConstructor;
    };
    data: {
        type: PropType<unknown>;
    };
    tag: {
        type: StringConstructor;
        default: string;
    };
}>> & Readonly<{}>, {
    tag: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default featureToggle;
