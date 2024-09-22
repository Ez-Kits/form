import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	target: "es2016",
	splitting: true,
	sourcemap: false,
	treeshake: true,
	clean: true,
	dts: true,
	skipNodeModulesBundle: true,
	minify: false,
	external: ["joi", "@ez-kits/form-core"],
	tsconfig: "./tsconfig.json",
	keepNames: true,
});
