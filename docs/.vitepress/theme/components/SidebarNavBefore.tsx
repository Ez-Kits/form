/* @jsxImportSource vue */
import { defineComponent } from "vue";
import FrameworkSelector from "./FrameworkSelector";

export default defineComponent({
	setup() {
		return () => (
			<div>
				<FrameworkSelector />
			</div>
		);
	},
});
