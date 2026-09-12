import { computed as e, defineComponent as t, h as n, ref as r } from "vue";
import { useFeatureToggle as i } from "feature-toggle-api";
//#region src/index.ts
var a = i(), o = r(0);
a.on("visibilityrule", () => {
	o.value += 1;
}, { ignorePreviousRules: !0 });
var s = t({
	name: "Feature",
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
	setup(t, { slots: r }) {
		let i = e(() => (o.value, a.isActive(t.name, t.variant, t.data)));
		return () => i.value ? t.tag ? n(t.tag, {
			"feature-name": t.name,
			"feature-variant": t.variant
		}, r.default?.()) : r.default?.() ?? null : null;
	}
});
//#endregion
export { s as Feature, a as default, a as featureToggle };

//# sourceMappingURL=vue-feature-toggle.js.map