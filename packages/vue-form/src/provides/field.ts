/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FieldInstance } from "@ez-kits/form-core";
import type { DefaultValidationSchema } from "src/global";
import { getCurrentInstance, inject, provide } from "vue";

export interface InjectedFieldData<
	FieldValue = unknown,
	FormValues = unknown,
	ValidationSchema = DefaultValidationSchema
> {
	field: FieldInstance<FieldValue, FormValues, ValidationSchema>;
}

export const $fieldInjectKey = Symbol("ez-form-vue-field");

export function useInjectField<
	FieldValues = unknown,
	FormValues = unknown,
	ValidationSchema = DefaultValidationSchema
>() {
	const instance = getCurrentInstance() as any;

	const injected = (instance?.provides[$fieldInjectKey] ??
		inject($fieldInjectKey)) as InjectedFieldData;

	if (!injected) {
		throw new Error("[useInjectField] must be used after or inside [useField]");
	}

	return injected.field as FieldInstance<
		FieldValues,
		FormValues,
		ValidationSchema
	>;
}

export function provideField<
	FieldValue,
	FormValues,
	ValidationSchema = DefaultValidationSchema
>(field: FieldInstance<FieldValue, FormValues, ValidationSchema>) {
	provide($fieldInjectKey, { field });
}
