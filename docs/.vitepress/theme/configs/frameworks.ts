import { baseUrl } from "./url";

export interface FrameworkInfo {
	name: string;
	id: string;
	logo: string;
}

export const frameworks: FrameworkInfo[] = [
	{
		name: "React",
		id: "react",
		logo: `${baseUrl}/react.svg`,
	},
	{
		name: "Vue",
		id: "vue",
		logo: `${baseUrl}/vue.png`,
	},
	{
		name: "Solid",
		id: "solid",
		logo: `${baseUrl}/solid.svg`,
	},
	{
		name: "Vanilla",
		id: "vanilla",
		logo: `${baseUrl}/vanilla.png`,
	},
];

export const defaultFramework = frameworks[0];
