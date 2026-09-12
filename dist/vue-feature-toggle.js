import * as e from "vue";
import { useFeatureToggle as t } from "feature-toggle-api";
//#region src/index.ts
var n = t();
function r(e) {
	return typeof e == "function" ? e() : e;
}
function i(t) {
	return {
		props: {
			name: { type: String },
			variant: { type: String },
			data: { type: [Object, String] },
			tag: {
				type: String,
				default: ""
			}
		},
		name: "feature",
		data() {
			return { isVisible: t.isVisible(this.name, this.variant, this.data) };
		},
		render: function(t) {
			if (this.isVisible) return this.tag ? (e.h || t)(this.tag, {
				"feature-name": this.name,
				"feature-variant": this.variant
			}, r(this.$slots.default)) : r(this.$slots.default);
		},
		methods: { _isVisible: function(e, n, r) {
			return t.isVisible(e, n, r);
		} }
	};
}
n.addPlugin(i);
//#endregion
export { n as default };

//# sourceMappingURL=vue-feature-toggle.js.map