// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import "vitepress-plugin-sandpack/dist/style.css";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import { CustomSandbox } from "./components/CustomSandbox";
import SidebarNavBefore from "./components/SidebarNavBefore";
import "./style.css";

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			"sidebar-nav-before": () => h(SidebarNavBefore),
		});
	},
	enhanceApp({ app }) {
		enhanceAppWithTabs(app as any);
		app.component("Sandbox", CustomSandbox);
	},
} satisfies Theme;
