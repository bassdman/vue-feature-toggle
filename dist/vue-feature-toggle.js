import { computed as e, defineComponent as t, h as n, ref as r } from "vue";
import { useFeatureToggle as i } from "feature-toggle-api";
//#region src/index.ts
function a(a = {}) {
	let o = i(a), s = r(0);
	return o.on("visibilityrule", () => {
		s.value += 1;
	}, { ignorePreviousRules: !0 }), {
		featureToggle: o,
		Feature: t({
			name: "Feature",
			props: {
				name: {
					type: String,
					required: !0
				},
				variant: { type: String },
				data: { type: null },
				tag: {
					type: String,
					default: ""
				}
			},
			setup(t, { slots: r }) {
				let i = e(() => (s.value, o.isActive(t.name, t.variant, t.data)));
				return () => i.value ? t.tag ? n(t.tag, {
					"feature-name": t.name,
					"feature-variant": t.variant
				}, r.default?.()) : r.default?.() ?? null : null;
			}
		})
	};
}
var o = a(), s = o.featureToggle, c = o.Feature;
//#endregion
export { c as Feature, a as createFeatureToggle, s as default, s as featureToggle };

//# sourceMappingURL=vue-feature-toggle.js.map