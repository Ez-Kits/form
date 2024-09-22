import {
	ToEvent,
	ValidateError,
	ValidateTrigger,
	ValidationOptions,
	ValidationSchemaInput,
	ValidationSChemaRecord,
} from "src/models";
import { toArray } from "src/utilities/array";
import { toEvent } from "src/utilities/mixed";
import { mapValues } from "src/utilities/object";

export const VALIDATE_TRIGGER_EVENTS: ToEvent<ValidateTrigger>[] = [
	"onBlur",
	"onChange",
	"onSubmit",
];

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

export function isValidationSchemaRecord<Schema>(
	input: ValidationSchemaInput<Schema>
): input is ValidationSChemaRecord<Schema> {
	if (Array.isArray(input)) {
		return false;
	}

	if (typeof input !== "object" || !input) {
		return false;
	}

	const inputKeys = Object.keys(input);

	const isValid = ["onChange", "onBlur", "onSubmit"].some((trigger) =>
		inputKeys.includes(trigger)
	);

	return isValid;
}

export function groupValidationSchemaInputByTrigger<Schema>(
	input: ValidationSchemaInput<Schema>
): ValidationSChemaRecord<Schema> | Schema[] {
	if (Array.isArray(input)) {
		return input;
	}

	if (isValidationSchemaRecord(input)) {
		return mapValues(input, (schema) => {
			if (!schema) {
				return [];
			}

			return toArray(schema);
		});
	}

	return [input as Schema];
}

export function getValidationSchema<ValidationSchema>(
	input: ValidationSchemaInput<ValidationSchema>,
	options?: ValidationOptions
): ValidationSchema[] {
	const groupedValidationSchemas = groupValidationSchemaInputByTrigger(input);

	if (Array.isArray(groupedValidationSchemas)) {
		return groupedValidationSchemas;
	}

	if (!options?.trigger) {
		return Object.values(groupedValidationSchemas).flat();
	}

	return toArray(options.trigger).flatMap((trigger) => {
		return groupedValidationSchemas[toEvent(trigger)] ?? [];
	});
}
