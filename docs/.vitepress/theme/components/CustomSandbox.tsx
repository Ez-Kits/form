/* @jsxImportSource vue */
import { Sandbox, sandboxProps } from "vitepress-plugin-sandpack";
import { defineComponent } from "vue";

/**
 * extends from Sandbox.
 * Compared to VUE single file, it is simple and straightforward.
 */
export const CustomSandbox = defineComponent({
	name: "MySandbox",
	props: sandboxProps,
	setup(props, { slots }) {
		console.log("Sandbox props", props);

		return () => (
			<Sandbox
				{...props}
				options={{
					showLineNumbers: true,
				}}
			>
				{slots?.default ? slots.default() : null}
			</Sandbox>
		);
	},
});
