import { GLOBAL_ERROR_FIELD, Validator } from "@ez-kits/form-core";
import Schema, {
	ValidateOption,
	type Rule,
	type ValidateError,
} from "async-validator";

export interface CreateAsyncValidatorOptions extends ValidateOption {}

export const createAsyncValidator = (
	options?: CreateAsyncValidatorOptions
): Validator<Rule> => {
	return {
		async validate({ schema, value, field }) {
			const validator = new Schema({
				__private__: schema,
			});

			return validator
				.validate(
					{
						__private__: value,
					},
					options
				)
				.then(() => {
					return {
						valid: true,
						errors: [],
					};
				})
				.catch(({ errors }: { errors: ValidateError[] }) => {
					return {
						valid: false,
						errors: errors.map((error) => {
							return {
								field: getFieldPath(error.field ?? "", field),
								messages: [getErrorMessage(error.message ?? "", field)],
							};
						}),
					};
				});
		},
	};
};

export const asyncValidator: Validator<Rule> = createAsyncValidator();

function getFieldPath(path: string, field?: string) {
	if (field) {
		return path.length > 0 && path !== "__private__"
			? path.replace(new RegExp("__private__", "g"), field)
			: field;
	}

	return path.length > 0 && path !== "__private__"
		? path.replace(new RegExp("__private__.?", "g"), "")
		: GLOBAL_ERROR_FIELD;
}

function getErrorMessage(message: string, field?: string) {
	if (!message) {
		return message;
	}

	return message.replace(new RegExp("__private__", "g"), field ? field : "");
}
