import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/plugin.ts"],
	format: ["cjs", "esm"],
	splitting: true,
	sourcemap: false,
	clean: true,
	treeshake: true,
	dts: true,

	skipNodeModulesBundle: true,
	minify: false,
	external: ["vue", "@ez-kits/form-core"],
	injectStyle: false,
	keepNames: true,
});
