import vueJsx from "@vitejs/plugin-vue-jsx";
import markdownConditionalRender from "markdown-it-conditional-render";
import container from "markdown-it-container";
import { resolve } from "path";
import ViteRestart from "vite-plugin-restart";
import { defineConfig } from "vitepress";
import { renderSandbox } from "vitepress-plugin-sandpack";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import localSearch from "./plugins/localSearch";
import { frameworks } from "./theme/configs/frameworks";
import { generateSidebar } from "./theme/configs/sidebar";
import { vitepressBaseUrl } from "./theme/configs/url";

export default defineConfig({
	vite: {
		plugins: [
			// @ts-expect-error
			vueJsx(),
			localSearch({
				computeTitles(id, titles) {
					const framework = frameworks.find((f) =>
						id.startsWith(`${vitepressBaseUrl}${f.id}`)
					);

					if (framework) {
						return [framework.name, ...titles];
					}

					return titles;
				},
			}),
			// @ts-expect-error
			ViteRestart({
				restart: ["docs/**/*.md"],
			}),
		],
		publicDir: "../public",
		resolve: {
			alias: [
				{
					find: "@/",
					replacement: resolve(__dirname, "../"),
				},
			],
		},
	},
	markdown: {
		lineNumbers: true,
		config(md) {
			md.use(tabsMarkdownPlugin);
			md.use(container, "sandbox", {
				render(tokens, idx) {
					return renderSandbox(tokens, idx, "sandbox");
				},
			});
			// @ts-expect-error
			md.use(markdownConditionalRender, {
				validate(condition) {
					const [left, right] = condition.split("=", 2);
					const validLefts = ["framework"];

					return validLefts.includes(left) && (right ? true : false);
				},
				evaluate(condition, value) {
					const [left, right] = condition.split("=", 2);

					if (left === "framework") {
						return "relativePath" in value
							? value.relativePath.startsWith(right)
							: false;
					}

					return false;
				},
			});
		},
	},
	base: vitepressBaseUrl,
	srcDir: "src",
	title: "Ez Form",
	description: "Powerful, type-safe, easy-to-use form package.",
	head: [["link", { rel: "icon", href: "/ez-form/favicon.ico" }]],
	themeConfig: {
		siteTitle: "Ez Form",
		logo: "/logo.png",
		nav: [
			{
				text: "Guide",
				link: "/react/guide/why-ez-form",
				activeMatch: "/guide/",
			},
			// {
			// 	text: "API Reference",
			// 	link: "/api-reference/main-api/form-instance",
			// 	activeMatch: "/api-reference/",
			// },
		],
		socialLinks: [{ icon: "github", link: "https://github.com/Ez-Kits/form" }],
		outline: [2, 6],
		footer: {
			copyright: "Made by Niku with ❣",
			message: "Ez Form",
		},
		search: {
			provider: "local",
			options: {
				detailedView: true,
			},
		},

		sidebar: generateSidebar(),
	},
});
