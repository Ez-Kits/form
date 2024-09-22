import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			reporter: ["json-summary", "text"],
			include: ["packages/*/src/**"],
			exclude: ["packages/vue-form-devtools-old/**"],
		},
	},
});
