import type { FormOptions, Validator } from "@ez-kits/form-core";
import { globalValidator, type DefaultValidationSchema } from "src/global";

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
