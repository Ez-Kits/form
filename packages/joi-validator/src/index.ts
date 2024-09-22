import { GLOBAL_ERROR_FIELD, Validator } from "@ez-kits/form-core";
import { ValidationOptions, type Schema } from "joi";

export interface CreateJoiValidatorOptions extends ValidationOptions {}

export const createJoiValidator = (
	options?: CreateJoiValidatorOptions
): Validator<Schema> => {
	return {
		async validate({ schema, value, field }) {
			const result = schema.validate(value, options);

			if (result.error === undefined) {
				return {
					valid: true,
					errors: [],
				};
			}

			const joiError = result.error;

			return {
				valid: false,
				errors: joiError.details.map((error) => ({
					messages: [error.message],
					field: getFieldPath(error.path, field),
				})),
			};
		},
	};
};

export const joiValidator: Validator<Schema> = createJoiValidator({
	abortEarly: false,
});

function getFieldPath(path: (string | number)[], field?: string) {
	if (field) {
		return path.length > 0 ? [field, ...path].join(".") : field;
	}

	return path.length > 0 ? path.join(".") : GLOBAL_ERROR_FIELD;
}
