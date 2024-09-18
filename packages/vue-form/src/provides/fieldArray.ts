/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FieldArrayInstance } from "@ez-kits/form-core";
import type { DefaultValidationSchema } from "src/global";
import { getCurrentInstance, inject, provide } from "vue";

export interface InjectedFieldArrayData<
	FieldValue = unknown,
	FormValues = unknown,
	ValidationSchema = DefaultValidationSchema
> {
	fieldArray: FieldArrayInstance<FieldValue, FormValues, ValidationSchema>;
}

export const $fieldArrayInjectKey = Symbol("ez-form-vue-field-array");

export function useInjectFieldArray<
	FieldValue = unknown,
	FormValues = unknown,
	ValidationSchema = DefaultValidationSchema
>() {
	const instance = getCurrentInstance() as any;

	const injected = (instance.provides[$fieldArrayInjectKey] ??
		inject($fieldArrayInjectKey)) as InjectedFieldArrayData;

	if (!injected) {
		throw new Error(
			"[useInjectFieldArray] must be used after or inside [useFieldArray]"
		);
	}

	return injected.fieldArray as FieldArrayInstance<
		FieldValue,
		FormValues,
		ValidationSchema
	>;
}

export function provideFieldArray<
	FieldValue,
	FormValues,
	ValidationSchema = DefaultValidationSchema
>(fieldArray: FieldArrayInstance<FieldValue, FormValues, ValidationSchema>) {
	provide($fieldArrayInjectKey, { fieldArray });
}
