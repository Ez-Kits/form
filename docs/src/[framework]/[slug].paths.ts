import glob from "fast-glob";
import { readFileSync } from "fs";
import { frameworks } from "../../.vitepress/theme/configs/frameworks";

export default {
	async paths() {
		const docsPaths = glob.globSync("docs/docs/common/**/*.md");

		const paths = frameworks.flatMap((config) => {
			return docsPaths.map((path) => {
				return {
					params: {
						framework: config.id,
						slug: path.replace("docs/docs/common", "").replace(".md", ""),
					},
					content: readFileSync(path, "utf-8"),
				};
			});
		});

		return paths;
	},
};
