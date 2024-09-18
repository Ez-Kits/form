import { ValidateError } from "src/models";

export function normalizeErrors(
	errors: ValidateError[],
	replace?: boolean
): ValidateError[] {
	const groupedErrors = errors.reduce<Record<string, ValidateError>>(
		(errors, error) => {
			const { field, messages } = error;
			if (!field || !messages) {
				return errors;
			}

			if (field in errors) {
				if (replace) {
					errors[field]!.messages = messages;
				} else {
					errors[field]!.messages = errors[field]!.messages.concat(messages);
				}
			} else {
				errors[field] = {
					field,
					messages,
				};
			}

			return errors;
		},
		{}
	);

	return Object.values(groupedErrors);
}
