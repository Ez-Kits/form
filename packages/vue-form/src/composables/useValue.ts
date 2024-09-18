import type {
	FieldArrayInstance,
	FieldBaseInstance,
	FieldMeta,
	FormInstance,
	FormMeta,
} from "@ez-kits/form-core";
import type { DefaultValidationSchema } from "src/global";
import { ref, type Ref } from "vue";

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
): Ref<T> {
	function getValue() {
		const newData = {
			meta: form.meta,
			values: form.values,
		};

		return selector ? selector(newData) : (newData as T);
	}

	const data = ref<T>(getValue()) as Ref<T>;

	form.on("change", () => {
		data.value = getValue();
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
): Ref<T> {
	return useFormData(form, ({ values }) =>
		selector ? selector(values) : values
	) as Ref<T>;
}

export function useFormMeta<FormValues, ValidationSchema, T = FormMeta>(
	form: FormInstance<FormValues, ValidationSchema>,
	selector?: (values: FormMeta) => T
) {
	return useFormData(form, ({ meta }) =>
		selector ? selector(meta) : meta
	) as Ref<T>;
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
): Ref<T> {
	function getValue() {
		const newData = { meta: field.meta, value: field.value };
		return selector ? selector(newData) : (newData as T);
	}

	const data = ref<T>(getValue()) as Ref<T>;

	field.on("change", () => {
		data.value = getValue();
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
): Ref<T> {
	return useFieldData(field, ({ value }) =>
		selector ? selector(value) : value
	) as Ref<T>;
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
	) as Ref<T>;
}

export function useFieldsInfo<
	FieldValue,
	FormValues,
	ValidationSchema = DefaultValidationSchema
>(field: FieldArrayInstance<FieldValue, FormValues, ValidationSchema>) {
	return useFieldData(field, () => field.getFieldsInfo());
}
