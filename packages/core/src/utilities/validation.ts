import type {
	ToEvent,
	ValidateError,
	ValidateTrigger,
	ValidationOptions,
	ValidationSchemaArrayRecord,
	ValidationSchemaInput,
	ValidationSchemaRecord,
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
	const groupedErrors = errors.reduce<
		Record<string, Record<ValidateTrigger, string[]>>
	>((errors, error) => {
		const { field, messages, trigger } = error;
		if (!field || !messages) {
			return errors;
		}
		const group = trigger;

		if (field in errors) {
			if (replace) {
				errors[field]![group] = messages;
			} else {
				errors[field]![group] = errors[field]![group].concat(messages);
			}
		} else {
			errors[field] = {
				[group]: messages,
			} as Record<ValidateTrigger, string[]>;
		}

		return errors;
	}, {});

	return Object.keys(groupedErrors).flatMap((field) => {
		const error = groupedErrors[field]!;
		const triggers = Object.keys(error) as ValidateTrigger[];
		return triggers.map((trigger) => {
			return {
				field,
				messages: error[trigger],
				trigger,
			};
		});
	});
}

export function isValidationSchemaRecord<Schema>(
	input: ValidationSchemaInput<Schema>
): input is ValidationSchemaRecord<Schema> {
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
): ValidationSchemaArrayRecord<Schema> | Schema[] {
	if (Array.isArray(input)) {
		return input;
	}

	if (isValidationSchemaRecord(input)) {
		return mapValues<ValidationSchemaRecord<Schema>, Schema[]>(
			input,
			(schema) => {
				if (!schema) {
					return [];
				}

				return toArray(schema as Schema | Schema[]);
			}
		);
	}

	return [input];
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

	return groupedValidationSchemas[toEvent(options.trigger)] ?? [];
}
