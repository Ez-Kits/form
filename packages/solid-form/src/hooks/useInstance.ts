import {
	GlobalInstances,
	getFieldArrayInstance,
	getFieldInstance,
	getFormInstance,
	type GetKeys,
} from "@ez-kits/form-core";
import { createSignal } from "solid-js";
import type { DefaultValidationSchema } from "src/global";

export function useFormInstance<
	Values,
	ValidationSchema = DefaultValidationSchema
>(formName: string) {
	const [instance, setInstance] = createSignal(
		getFormInstance<Values, ValidationSchema>(formName)
	);

	GlobalInstances.on("change", () => {
		setInstance(getFormInstance<Values, ValidationSchema>(formName));
	});

	return instance;
}

export function useFieldInstance<
	Values,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<Values> = GetKeys<Values>
>(formName: string, fieldName: N) {
	const [instance, setInstance] = createSignal(
		getFieldInstance<Values, ValidationSchema, N>(formName, fieldName)
	);

	GlobalInstances.on("change", () => {
		setInstance(
			getFieldInstance<Values, ValidationSchema, N>(formName, fieldName)
		);
	});

	return instance;
}

export function useFieldArrayInstance<
	Values,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<Values> = GetKeys<Values>
>(formName: string, fieldName: N) {
	const [instance, setInstance] = createSignal(
		getFieldArrayInstance<Values, ValidationSchema, N>(formName, fieldName)
	);

	GlobalInstances.on("change", () => {
		setInstance(
			getFieldArrayInstance<Values, ValidationSchema, N>(formName, fieldName)
		);
	});

	return instance;
}
