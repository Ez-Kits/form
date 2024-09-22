import { GLOBAL_ERROR_FIELD, Validator } from "@ez-kits/form-core";
import {
	BaseIssue,
	Config,
	GenericSchema,
	IssuePathItem,
	safeParse,
} from "valibot";

export interface CreateValibotValidatorOptions
	extends Config<BaseIssue<unknown>> {}

export const createValibotValidator = (
	options?: CreateValibotValidatorOptions
): Validator<GenericSchema> => {
	return {
		async validate({ schema, value, field }) {
			const result = safeParse(schema, value, options);

			if (result.success) {
				return {
					valid: true,
					errors: [],
				};
			}

			return {
				valid: false,
				errors: result.issues.map((issue) => ({
					messages: [issue.message],
					field: getFieldPath(issue.path ?? [], field),
				})),
			};
		},
	};
};

export const valibotValidator: Validator<GenericSchema> =
	createValibotValidator({
		abortEarly: false,
	});

function getFieldPath(path: IssuePathItem[], field?: string) {
	if (field) {
		return path.length > 0
			? [field, ...path.map((d) => d.key)].join(".")
			: field;
	}

	return path.length > 0
		? path.map((d) => d.key).join(".")
		: GLOBAL_ERROR_FIELD;
}
