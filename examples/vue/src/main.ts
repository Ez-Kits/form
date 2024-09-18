import { registerGlobalValidator } from "@ez-kits/form-vue";
import { EzFormDevtool } from "@ez-kits/form-vue-devtools-old";
import EzFormPlugin from "@ez-kits/form-vue/plugin";
import { zodValidator } from "@ez-kits/form-zod-validator";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

declare module "@ez-kits/form-vue" {
	interface GlobalRegister {
		validator: typeof zodValidator;
	}
}

registerGlobalValidator(zodValidator);

createApp(App).use(EzFormDevtool).use(EzFormPlugin).mount("#app");
