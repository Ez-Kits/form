import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/types.ts"],
	format: ["cjs", "esm"],
	target: "es2016",
	splitting: true,
	sourcemap: false,
	clean: true,
	treeshake: true,
	dts: true,
	skipNodeModulesBundle: true,
	minify: false,
	external: ["vue", "@vue/devtools-api", "@ez-kits/form-core"],
	injectStyle: false,
	keepNames: true,
});
