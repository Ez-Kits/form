import { GLOBAL_ERROR_FIELD, Validator } from "@ez-kits/form-core";
import { ValidateOptions, type Schema, type ValidationError } from "yup";

export interface CreateYupValidatorOptions extends ValidateOptions {}

export const createYupValidator = (
	options?: CreateYupValidatorOptions
): Validator<Schema> => {
	return {
		async validate({ schema, value, field }) {
			try {
				await schema.validate(value, options);

				return {
					valid: true,
					errors: [],
				};
			} catch (error) {
				const yupError = error as ValidationError;

				if (field) {
					return {
						valid: false,
						errors: yupError.inner.map((error) => ({
							messages: error.errors,
							field: error.path ? `${field}.${error.path}` : field,
						})),
					};
				}

				return {
					valid: false,
					errors: yupError.inner.map((error) => ({
						messages: error.errors,
						field: error.path ?? GLOBAL_ERROR_FIELD,
					})),
				};
			}
		},

		// extractSchema(schema, field) {
		// 	return reach(schema, field) as Schema;
		// },
	};
};

export const yupValidator: Validator<Schema> = createYupValidator({
	abortEarly: false,
});
