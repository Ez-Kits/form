import type {
	FieldBaseInstance,
	FieldMeta,
	FormInstance,
	FormMeta,
} from "@ez-kits/form-core";
import { createSignal, onCleanup, type Accessor } from "solid-js";
import type { DefaultValidationSchema } from "src/global";

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
) {
	function getData() {
		const value = {
			meta: form.meta,
			values: form.values,
		};

		return (selector ? selector(value) : value) as T;
	}

	const [data, setData] = createSignal(getData());

	const unsubscribe = form.on("change", () => {
		setData(() => getData());
	});

	onCleanup(() => {
		unsubscribe();
	});

	return data;
}

export function useFormValues<
	FormValues,
	ValidationSchema = DefaultValidationSchema,
	T = FormValues
>(
	form: FormInstance<FormValues, ValidationSchema>,
	selector?: (values: FormValues) => T
): Accessor<T> {
	return useFormData(form, ({ values }) =>
		selector ? selector(values) : values
	) as Accessor<T>;
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
	) as Accessor<T>;
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
): Accessor<T> {
	function getData() {
		const value = {
			meta: field.meta,
			value: field.getValue(),
		};

		return (selector ? selector(value) : value) as T;
	}

	const [data, setData] = createSignal(getData());

	const unsubscribe = field.on("change", () => {
		setData(() => getData());
	});

	onCleanup(() => {
		unsubscribe();
	});

	return data;
}

export function useFieldValue<
	FieldValue,
	FormValues,
	ValidationSchema = DefaultValidationSchema,
	T = FieldValue
>(
	field: FieldBaseInstance<FieldValue, FormValues, ValidationSchema>,
	selector?: (values: FieldValue) => T
): Accessor<T> {
	return useFieldData(field, ({ value }) =>
		selector ? selector(value) : value
	) as Accessor<T>;
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
	) as Accessor<T>;
}
