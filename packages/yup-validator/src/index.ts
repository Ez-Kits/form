import { GLOBAL_ERROR_FIELD, Validator } from "@ez-kits/form-core";
import { Schema, ValidationError } from "yup";

export const yupValidator: Validator<Schema> = {
	async validate({ schema, value, field }) {
		try {
			await schema.validate(value);

			return {
				valid: true,
				errors: [],
			};
		} catch (error) {
			const yupError = error as ValidationError;
			if (field) {
				return {
					valid: false,
					errors: [
						{
							messages: yupError.errors,
							field: yupError.path ? `${field}.${yupError.path}` : field,
						},
					],
				};
			}

			return {
				valid: false,
				errors: [
					{
						messages: yupError.errors,
						field: yupError.path ?? GLOBAL_ERROR_FIELD,
					},
				],
			};
		}
	},

	// extractSchema(schema, field) {
	// 	return reach(schema, field) as Schema;
	// },
};
