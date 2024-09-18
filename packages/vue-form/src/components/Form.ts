/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FormInstance, FormOptions } from "@ez-kits/form-core";
import type { DefaultValidationSchema } from "src/global";
import { useForm } from "src/index";
import { formProps } from "src/utilities/form";
import { defineComponent, getCurrentInstance } from "vue";

export interface FormProps<
	FormValues,
	ValidationSchema = DefaultValidationSchema
> extends FormOptions<FormValues, ValidationSchema> {
	form?: FormInstance<FormValues, ValidationSchema>;
}

const FormImpl = defineComponent({
	name: "EzForm",
	props: formProps(),
	setup(props, ctx) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const form = useForm(props as any);
		const componentInstance = getCurrentInstance();
		if (componentInstance) {
			form.uid = componentInstance.uid.toString();
		}
		return () => ctx.slots.default?.();
	},
});

const EzForm = FormImpl as unknown as FormComponent<any>;

export default EzForm;

type BaseFormType = typeof FormImpl;

export type FormComponent<
	FormValues,
	ValidationSchema = DefaultValidationSchema
> = Omit<BaseFormType, "$props"> & {
	new (): {
		$props: FormProps<FormValues, ValidationSchema>;
		$slots: {
			default: () => any;
		};
	};
};
