import { computed as e, defineComponent as t, h as n, ref as r } from "vue";
import { useFeatureToggle as i } from "feature-toggle-api";
//#region src/index.ts
var a = i(), o = r(0);
a.on("visibilityrule", () => {
	o.value += 1;
}, { ignorePreviousRules: !0 });
function s(r) {
	return t({
		props: {
			name: {
				type: String,
				required: !0
			},
			variant: { type: String },
			data: { type: [Object, String] },
			tag: {
				type: String,
				default: ""
			}
		},
		name: "feature",
		setup(t, { slots: i }) {
			let a = e(() => (o.value, r.isActive(t.name, t.variant, t.data)));
			return () => a.value ? t.tag ? n(t.tag, {
				"feature-name": t.name,
				"feature-variant": t.variant
			}, i.default?.()) : i.default?.() ?? null : null;
		}
	});
}
a.addPlugin(s);
//#endregion
export { a as default };

//# sourceMappingURL=vue-feature-toggle.js.map