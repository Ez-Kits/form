import {
	FieldInstance,
	type FormInstance,
	type GetKeys,
} from "@ez-kits/form-core";
import type { DefaultValidationSchema } from "src/global";
import { useField } from "src/index";
import { useInjectForm } from "src/provides/form";
import { defineComponent, type PropType } from "vue";

export type ObserveFieldProps<
	FormValues,
	N extends string = GetKeys<FormValues>
> = {
	name: N;
	selector?: (value: any) => any;
};

/**
 * Observe field's value
 */
const ObserveFieldImpl = defineComponent({
	name: "EzObserveField",
	props: {
		name: {
			type: String,
			required: true,
		},
		selector: {
			type: Function as PropType<(values: any) => any>,
			default: undefined,
			required: false,
		},
	},
	setup(props, ctx) {
		const form = useInjectForm();
		const field = useField({
			name: props.name as never,
			// preserveValue: true,
			registerInstance: false,
		});
		form.removeField(field as unknown as FieldInstance<any, unknown, unknown>);
		const value = field.useFieldValue<unknown>(props.selector);

		return () => ctx.slots.default?.({ form, field, value: value.value });
	},
});

const ObserveField = ObserveFieldImpl as unknown as ObserveFieldComponent<any>;

export default ObserveField;

type BaseObserveFieldType = typeof ObserveFieldImpl;

export type ObserveFieldComponent<
	FormValues,
	ValidationSchema = DefaultValidationSchema
> = Omit<BaseObserveFieldType, "$props"> & {
	new (): {
		$props: ObserveFieldProps<FormValues>;
		$slots: {
			default: (helpers: {
				field: FieldInstance<any, FormValues, ValidationSchema>;
				form: FormInstance<FormValues, ValidationSchema>;
				value: any;
			}) => void;
		};
	};
};
