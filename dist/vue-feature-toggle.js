import { computed as e, defineComponent as t, h as n } from "vue";
import { useFeatureToggle as r } from "feature-toggle-api";
//#region src/index.ts
var i = r();
function a(r) {
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
			let a = e(() => r.isActive(t.name, t.variant, t.data));
			return () => a.value ? t.tag ? n(t.tag, {
				"feature-name": t.name,
				"feature-variant": t.variant
			}, i.default?.()) : i.default?.() ?? null : null;
		}
	});
}
i.addPlugin(a);
//#endregion
export { i as default };

//# sourceMappingURL=vue-feature-toggle.js.map