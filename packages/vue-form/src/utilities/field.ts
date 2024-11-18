import type {
	FieldOptions,
	FormInstance,
	GetKeys,
	ValidateTrigger,
} from "@ez-kits/form-core";
import type { DefaultValidationSchema } from "src/global";
import type { PropType } from "vue";

export type FieldNameProps<ParentValue, N = GetKeys<ParentValue>> = { name: N };

export function fieldProps<
	FieldValue,
	FormValues,
	ValidationSchema = DefaultValidationSchema
>(namePrefix?: string) {
	return {
		name: {
			type: String as unknown as PropType<GetKeys<FormValues>>,
			required: true,
		},
		namePrefix: {
			type: String,
			required: false,
			default: namePrefix,
		},
		inputIndex: {
			type: Number,
			required: false,
		},
		label: {
			type: String,
			required: false,
		},
		initialValue: {
			type: Object as PropType<FieldValue>,
			required: false,
		},
		validateTrigger: {
			type: [String, Array] as PropType<ValidateTrigger | ValidateTrigger[]>,
			required: false,
		},
		validationSchema: {
			type: [Object, Function, Array] as PropType<
				FieldOptions<
					FieldValue,
					FormValues,
					ValidationSchema
				>["validationSchema"]
			>,
			required: false,
		},
		form: {
			type: Object as PropType<FormInstance<FieldValue, ValidationSchema>>,
			required: false,
		},
		// preserveValue: {
		// 	type: Boolean,
		// 	required: false,
		// },
		onChange: {
			type: Function as PropType<(value: FieldValue) => void>,
			required: false,
		},
		onBlur: {
			type: Function as PropType<(event: any) => void>,
			required: false,
		},
		valuePropName: {
			type: String,
			default: "value",
		},
		onChangePropName: {
			type: String,
			required: false,
		},
		onBlurPropName: {
			type: String,
			default: "onBlur",
		},
	};
}

export function fieldArrayProps<
	FieldValue,
	FormValues,
	ValidationSchema = DefaultValidationSchema
>(namePrefix?: string) {
	return {
		name: {
			type: String as unknown as PropType<GetKeys<FormValues>>,
			required: true,
		},
		namePrefix: {
			type: String,
			required: false,
			default: namePrefix,
		},
		label: {
			type: String,
			required: false,
		},
		initialValue: {
			type: Object as PropType<FieldValue>,
			required: false,
		},
		validateTrigger: {
			type: [String, Array] as PropType<ValidateTrigger | ValidateTrigger[]>,
			required: false,
		},
		validationSchema: {
			type: [Object, Function, Array] as PropType<
				FieldOptions<
					FieldValue,
					FormValues,
					ValidationSchema
				>["validationSchema"]
			>,
			required: false,
		},
		form: {
			type: Object as PropType<FormInstance<FieldValue, ValidationSchema>>,
			required: false,
		},
		// preserveValue: {
		// 	type: Boolean,
		// 	required: false,
		// },
		onChange: {
			type: Function as PropType<(value: FieldValue) => void>,
			required: false,
		},
		onBlur: {
			type: Function as PropType<(event: any) => void>,
			required: false,
		},
	};
}
