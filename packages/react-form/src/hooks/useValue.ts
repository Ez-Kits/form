/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
	type FieldBaseInstance,
	type FieldMeta,
	type FormInstance,
	type FormMeta,
} from "@ez-kits/form-core";
import { useRef } from "react";
import type { DefaultValidationSchema } from "src/global";
import { useSyncExternalStore } from "use-sync-external-store/shim";

export interface UseFormDataValues<FormValues> {
	meta: FormMeta;
	values: FormValues;
}

export function useFormData<
	FormValues,
	ValidationSchema = DefaultValidationSchema,
	T = UseFormDataValues<FormValues>
>(
	form: FormInstance<FormValues, ValidationSchema>,
	selector?: (values: UseFormDataValues<FormValues>) => T
): T {
	const dataRef = useRef<UseFormDataValues<FormValues>>({
		meta: form.meta,
		values: form.values,
	});

	return useSyncExternalStore(
		(listener) =>
			form.on("change", () => {
				dataRef.current = {
					meta: { ...form.meta },
					values: { ...form.values },
				};

				return listener();
			}),
		() => {
			if (selector) {
				return selector(dataRef.current);
			}

			return dataRef.current as T;
		},
		() => {
			if (selector) {
				return selector(dataRef.current);
			}

			return dataRef.current as T;
		}
	);
}

export function useFormValues<
	FormValues,
	ValidationSchema = DefaultValidationSchema,
	T = FormValues
>(
	form: FormInstance<FormValues, ValidationSchema>,
	selector?: (values: FormValues) => T
): T {
	return useFormData(form, ({ values }) =>
		selector ? selector(values) : values
	) as T;
}

export function useFormMeta<
	FormValues,
	ValidationSchema = DefaultValidationSchema,
	T = FormMeta
>(
	form: FormInstance<FormValues, ValidationSchema>,
	selector?: (values: FormMeta) => T
) {
	return useFormData(form, ({ meta }) =>
		selector ? selector(meta) : meta
	) as T;
}

export interface UseFieldDataValues<FieldValue> {
	meta: FieldMeta;
	value: FieldValue;
}

export function useFieldData<
	FieldValue,
	FormValues,
	ValidationSchema = DefaultValidationSchema,
	T = UseFormDataValues<FieldValue>
>(
	field: FieldBaseInstance<FieldValue, FormValues, ValidationSchema>,
	selector?: (values: UseFieldDataValues<FieldValue>) => T
): T {
	const dataRef = useRef<UseFieldDataValues<FieldValue>>({
		meta: field.meta,
		value: field.value,
	});

	return useSyncExternalStore(
		(listener) =>
			field.on("change", () => {
				dataRef.current = {
					meta: { ...field.meta },
					value: (Array.isArray(field.value)
						? [...field.value]
						: typeof field.value === "object"
						? { ...field.value }
						: field.value) as FieldValue,
				};

				return listener();
			}),
		() => {
			if (selector) {
				return selector(dataRef.current);
			}

			return dataRef.current as T;
		},
		() => {
			if (selector) {
				return selector(dataRef.current);
			}

			return dataRef.current as T;
		}
	);
}

export function useFieldValue<
	FieldValue,
	FormValues,
	ValidationSchema = DefaultValidationSchema,
	T = FieldValue
>(
	field: FieldBaseInstance<FieldValue, FormValues, ValidationSchema>,
	selector?: (values: FieldValue) => T
): T {
	return useFieldData(field, ({ value }) =>
		selector ? selector(value) : value
	) as T;
}

export function useFieldMeta<
	FieldValue,
	FormValues,
	ValidationSchema = DefaultValidationSchema,
	T = FieldValue
>(
	field: FieldBaseInstance<FieldValue, FormValues, ValidationSchema>,
	selector?: (values: FieldMeta) => T
) {
	return useFieldData(field, ({ meta }) =>
		selector ? selector(meta) : meta
	) as T;
}
