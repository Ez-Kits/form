import { GLOBAL_ERROR_FIELD, Validator } from "@ez-kits/form-core";
import { type Schema } from "joi";

export const joiValidator: Validator<Schema> = {
	async validate({ schema, value, field }) {
		const result = schema.validate(value, {
			abortEarly: false,
		});

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

function getFieldPath(path: (string | number)[], field?: string) {
	if (field) {
		return path.length > 0 ? [field, ...path].join(".") : field;
	}

	return path.length > 0 ? path.join(".") : GLOBAL_ERROR_FIELD;
}
