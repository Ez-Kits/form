/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
	FieldInstance,
	type FormInstance,
	type GetKeys,
	type GetType,
} from "@ez-kits/form-core";
import type { Accessor, JSXElement } from "solid-js";
import type { DefaultValidationSchema } from "src/global";
import useFormContext from "src/hooks/useFormContext";
import { useField } from "src/index";

export type ObserveFieldProps<
	FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends string = GetKeys<FormValues>,
	T = GetType<FormValues, N>
> = {
	name: N;
	selector?: (value: GetType<FormValues, N>) => T;
	children?: (helpers: {
		field: FieldInstance<GetType<FormValues, N>, FormValues, ValidationSchema>;
		form: FormInstance<FormValues, ValidationSchema>;
		value: Accessor<T>;
	}) => JSXElement;
};

/**
 * Observe field's value
 */
export function ObserveField<
	FormValues,
	ValidationSchema = DefaultValidationSchema
>(props: ObserveFieldProps<FormValues, ValidationSchema>) {
	const form = useFormContext<FormValues, ValidationSchema>();
	const field = useField<FormValues, FormValues, ValidationSchema>({
		name: props.name,
		preserveValue: true,
		registerInstance: false,
	} as any);
	form.removeField(field);
	field.useFieldMeta();
	const value = field.useFieldValue(props.selector);

	return <>{props.children ? props.children({ field, form, value }) : null}</>;
}

ObserveField.displayName = "ObserveField";

// ---------------------------------------------

export type ObserveProps<
	FormValues,
	ValidationSchema = DefaultValidationSchema,
	T = FormValues
> = {
	selector?: (values: FormValues) => T;
	children?: (helpers: {
		form: FormInstance<FormValues, ValidationSchema>;
		values: Accessor<T>;
	}) => JSXElement;
};

/**
 * Observe form's values
 */
export function Observe<
	FormValues,
	ValidationSchema = DefaultValidationSchema,
	T = FormValues
>({ children, selector }: ObserveProps<FormValues, ValidationSchema, T>) {
	const form = useFormContext<FormValues, ValidationSchema>();
	form.useFormMeta();
	const values = form.useFormValues(selector);

	return <>{children ? children({ form, values }) : null}</>;
}

Observe.displayName = "Observe";
