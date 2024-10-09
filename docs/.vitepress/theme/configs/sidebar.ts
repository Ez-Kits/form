import { DefaultTheme } from "vitepress";
import { frameworks } from "./frameworks";

const baseSidebar = {
	"/guide/": [
		{
			text: "Getting Started",
			items: [
				{ text: "Why Ez Form?", link: "/guide/why-ez-form" },
				{ text: "Installation", link: "/guide/installation" },
				{ text: "Devtool", link: "/guide/devtool" },
			],
		},
		{
			text: "Essentials",
			items: [
				{ text: "Basic Concepts", link: "/guide/basic-concepts" },
				{ text: "Basic Form", link: "/guide/basic-form" },
				{ text: "Validation", link: "/guide/validation" },
				{ text: "Field Array", link: "/guide/field-array" },
				{ text: "Auto Binding", link: "/guide/auto-binding" },
			],
		},
		// {
		// 	text: "Composables",
		// 	items: [
		// 		{
		// 			text: "useForm",
		// 			link: "/guide/use-form",
		// 		},
		// 		{
		// 			text: "useFormItem",
		// 			link: "/guide/use-form-item",
		// 		},
		// 		{
		// 			text: "useFormList",
		// 			link: "/guide/use-form-list",
		// 		},
		// 	],
		// },
		// {
		// 	text: "Customization",
		// 	items: [
		// 		{
		// 			text: "Custom Form",
		// 			link: "/guide/custom-form",
		// 		},
		// 		{
		// 			text: "Custom FormItem",
		// 			link: "/guide/custom-form-item",
		// 		},
		// 		{
		// 			text: "Custom FormList",
		// 			link: "/guide/custom-form-list",
		// 		},
		// 		{
		// 			text: "Custom Input",
		// 			link: "/guide/custom-input",
		// 		},
		// 	],
		// },

		{
			text: "Utilities",
			items: [
				{
					text: "Multi-step Form",
					link: "/guide/multi-step-form",
				},
				{
					text: "Get Instances",
					link: "/guide/get-instances",
				},
			],
		},
	],

	"/api-reference/": [
		{
			text: "Main API",
			items: [
				{
					text: "Form Instance",
					link: "/api-reference/main-api/form-instance",
				},
				{
					text: "FormItem Instance",
					link: "/api-reference/main-api/form-item-instance",
				},
				{
					text: "FormList Instance",
					link: "/api-reference/main-api/form-list-instance",
				},
			],
		},
		{
			text: "Components",
			items: [
				{ text: "Form", link: "/api-reference/components/form" },
				{ text: "FormItem", link: "/api-reference/components/form-item" },
				{ text: "FormList", link: "/api-reference/components/form-list" },
			],
		},
		{
			text: "Typescript",
			items: [
				{ text: "Form", link: "/api-reference/types/form" },
				{ text: "Form Item", link: "/api-reference/types/form-item" },
				{ text: "Form List", link: "/api-reference/types/form-list" },
				{ text: "Validation", link: "/api-reference/types/validation" },
			],
		},
	],
};

export function generateSidebar() {
	const sidebar: DefaultTheme.Sidebar = {
		...baseSidebar,
	};
	frameworks.forEach((f) => {
		const sidebarGroupKeys = Object.keys(baseSidebar);
		sidebarGroupKeys.forEach((key) => {
			const sidebarGroup = baseSidebar[key] as DefaultTheme.SidebarItem[];
			const sidebarGroupKey = `/${f.id}${key}`;
			const computedItems = sidebarGroup.map((item) => {
				const newItem: DefaultTheme.SidebarItem = {
					text: item.text,
				};
				if (item.link) {
					newItem.link = `/${f.id}${item.link}`;
				}

				if (item.items) {
					newItem.items = item.items.map((subItem) => {
						return {
							text: subItem.text,
							link: `/${f.id}${subItem.link}`,
						};
					});
				}

				return newItem;
			});

			sidebar[sidebarGroupKey] = computedItems;
		});
	});

	return sidebar;
}
