import { GLOBAL_ERROR_FIELD, type Validator } from "src/index";
import { type Schema, type ValidateOptions, type ValidationError } from "yup";

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
							field: getFieldPath(error.path ?? "", field),
						})),
					};
				}

				return {
					valid: false,
					errors: yupError.inner.map((error) => ({
						messages: error.errors,
						field: getFieldPath(error.path ?? ""),
					})),
				};
			}
		},

		// extractSchema(schema, field) {
		// 	return reach(schema, field) as Schema;
		// },
	};
};

function getFieldPath(path: string, field?: string) {
	if (field) {
		const joinedPath = path.length > 0 ? `${field}.${path}` : field;
		return joinedPath.replace(/\[([0-9]+)\]/g, "$1");
	}

	return path.length > 0
		? path.replace(/\[([0-9]+)\]/g, "$1")
		: GLOBAL_ERROR_FIELD;
}

export const yupValidator: Validator<Schema> = createYupValidator({
	abortEarly: false,
});
