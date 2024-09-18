import { GLOBAL_ERROR_FIELD, Validator } from "@ez-kits/form-core";
import Schema, { Rule, ValidateError } from "async-validator";

export const asyncValidator: Validator<Rule> = {
	async validate({ schema, value, field }) {
		const validator = new Schema({
			__private__: schema,
		});

		return validator
			.validate({
				__private__: value,
			})
			.then(() => {
				return {
					valid: true,
					errors: [],
				};
			})
			.catch(({ errors }) => {
				return {
					valid: false,
					errors: Array.isArray(errors)
						? (errors as ValidateError[]).map((error) => {
								return {
									field: getFieldPath(error.field ?? "", field),
									messages: [getErrorMessage(error.message ?? "", field)],
								};
						  })
						: [],
				};
			});
	},

	// extractSchema(schema, field) {
	// 	try {
	// 		const paths = castPath(field);
	// 		let resultSchema = schema;
	// 		for (const path of paths) {
	// 			const maybeNumberPath = Number(path);
	// 			const isNumberPath = !Number.isNaN(maybeNumberPath);

	// 			if (isNumberPath) {
	// 				resultSchema = Array.isArray(resultSchema)
	// 					? (resultSchema
	// 							.map((schema) => schema.defaultField)
	// 							.filter(Boolean) as RuleItem[])
	// 					: ((resultSchema.defaultField ??
	// 							resultSchema.fields?.[maybeNumberPath]) as RuleItem);
	// 			} else {
	// 				resultSchema = Array.isArray(resultSchema)
	// 					? (resultSchema
	// 							.map((schema) => schema.fields?.[path])
	// 							.filter(Boolean) as RuleItem[])
	// 					: (resultSchema.fields?.[path] as RuleItem);
	// 			}
	// 		}

	// 		return resultSchema;
	// 	} catch {
	// 		return schema;
	// 	}
	// },
};

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
