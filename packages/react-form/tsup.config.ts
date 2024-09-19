import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	target: "es2016",
	splitting: true,
	sourcemap: false,
	clean: true,
	treeshake: true,
	dts: true,
	skipNodeModulesBundle: true,
	minify: false,
	external: [
		"react",
		"react-dom",
		"@ez-kits/form-core",
		"use-sync-external-store",
	],
	injectStyle: false,
	keepNames: false,
});
