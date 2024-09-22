import type { FormOptions, GetKeys, Validator } from "@ez-kits/form-core";
import { globalValidator, type DefaultValidationSchema } from "src/global";

export function handleEventPrevent<E extends Event>(cb: (event: E) => void) {
	return (event: E) => {
		if (event.defaultPrevented) {
			return;
		}
		event.preventDefault();
		cb(event);
	};
}

export type FieldNameProps<
	ParentValue,
	N = GetKeys<ParentValue>
> = ParentValue extends any[]
	? { index: number; name?: N }
	: { index?: number; name: N };

export function mergeFormOptions<
	Values,
	ValidationSchema = DefaultValidationSchema
>(
	options: FormOptions<Values, ValidationSchema>
): FormOptions<Values, ValidationSchema> {
	if (globalValidator) {
		return {
			validator: globalValidator as Validator<ValidationSchema>,
			...options,
		};
	}

	return options;
}
