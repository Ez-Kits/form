import { GLOBAL_ERROR_FIELD, Validator } from "@ez-kits/form-core";
import { ZodSchema } from "zod";

export const zodValidator: Validator<ZodSchema> = {
	async validate({ schema, value, field }) {
		const result = schema.safeParse(value);

		if (result.success) {
			return {
				valid: true,
				errors: [],
			};
		}

		const zodError = result.error;

		return {
			valid: false,
			errors: zodError.errors.map((error) => ({
				messages: [error.message],
				field: getFieldPath(error.path, field),
			})),
		};
	},

	// extractSchema(schema: ZodSchema, field: string): ZodSchema {
	// 	const paths = castPath(field);
	// 	let resultPath = schema;
	// 	try {
	// 		for (const path of paths) {
	// 			const maybeNumberPath = Number(path);
	// 			const isNumberPath = !Number.isNaN(maybeNumberPath);

	// 			if (isNumberPath) {
	// 				resultPath = (resultPath as ZodArray<any>).element;
	// 			} else {
	// 				resultPath = (resultPath as ZodObject<any>).shape[path];
	// 			}
	// 		}

	// 		return resultPath;
	// 	} catch (error) {
	// 		return schema;
	// 	}
	// },
};

function getFieldPath(path: (string | number)[], field?: string) {
	if (field) {
		return path.length > 0 ? [field, ...path].join(".") : field;
	}

	return path.length > 0 ? path.join(".") : GLOBAL_ERROR_FIELD;
}
