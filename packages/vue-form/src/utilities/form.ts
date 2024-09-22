import type {
	FormInstance,
	FormOptions,
	ValidateError,
	ValidateTrigger,
	Validator,
} from "@ez-kits/form-core";
import { globalValidator, type DefaultValidationSchema } from "src/global";
import type { PropType } from "vue";

export function formProps<Values, ValidationSchema = DefaultValidationSchema>(
	defaultForm?: FormInstance<Values, ValidationSchema>
) {
	return {
		form: {
			type: Object as PropType<FormInstance<Values, ValidationSchema>>,
			required: false,
			default: defaultForm,
		},
		name: {
			type: String,
			required: false,
		},
		initialValues: {
			type: Object as PropType<Values>,
			required: false,
		},
		enableReinitialize: {
			type: Boolean,
			required: false,
		},
		validationSchema: {
			type: [Object, Array] as PropType<ValidationSchema>,
			required: false,
		},
		validateTrigger: {
			type: [String, Array] as PropType<ValidateTrigger | ValidateTrigger[]>,
			required: false,
		},
		// preserveValues: {
		// 	type: Boolean,
		// 	required: false,
		// },
		onValuesChange: {
			type: Function as PropType<(values: Values, oldValues: Values) => void>,
			required: false,
		},
		onReset: {
			type: Function as PropType<() => void>,
			required: false,
		},
		onSubmit: {
			type: Function as PropType<(values: Values) => void>,
			required: false,
		},
		onError: {
			type: Function as PropType<(errors: ValidateError[]) => void>,
			required: false,
		},
		onValidate: {
			type: Function as PropType<() => void>,
			required: false,
		},
	};
}

export function formPropsArray() {
	return [
		"form",
		"name",
		"initialValues",
		"enableReinitialize",
		"validationSchema",
		"validateTrigger",
		"validateMessages",
		"preserveValues",
		"onValuesChange",
		"onReset",
		"onSubmit",
		"onError",
		"onValidate",
	] as const;
}

export function mergeFormOptions<
	Values,
	ValidationSchema = DefaultValidationSchema
>(
	options: FormOptions<Values, ValidationSchema>
): FormOptions<Values, ValidationSchema> {
	if (globalValidator) {
		return {
			validator: globalValidator as Validator<ValidationSchema>,
			...options,
		};
	}

	return options;
}
