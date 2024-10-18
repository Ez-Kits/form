/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
	FieldInstance,
	FormInstance,
	type FieldMeta,
	type FieldOptions,
	type GetKeys,
	type GetType,
} from "@ez-kits/form-core";
import type { ReactElement, ReactNode } from "react";
import fieldContext from "src/contexts/fieldContext";
import type { DefaultValidationSchema } from "src/global";
import useField from "src/hooks/useField";
import { useFormPropsOrContext } from "src/hooks/useFormPropsOrContext";
import type { FieldNameProps } from "src/utilities";

export type FieldProps<
	FormValue,
	ParentValue = FormValue,
	ValidationSchema = DefaultValidationSchema,
	N extends string = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> & {
	children?:
		| ReactNode
		| ((helpers: {
				form: FormInstance<FormValue, ValidationSchema>;
				field: FieldInstance<FieldValue, FormValue, ValidationSchema>;
				value: FieldValue;
				meta: FieldMeta;
		  }) => ReactNode);
} & Omit<FieldOptions<FieldValue, FormValue, ValidationSchema>, "name"> & {
		form?: FormInstance<FormValue, ValidationSchema>;
	};

export default function Field<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema
>({
	children,
	...options
}: FieldProps<FormValues, ParentValue, ValidationSchema>) {
	const field = useField<FormValues, ParentValue, ValidationSchema>(
		options as any
	);
	const form = useFormPropsOrContext<FormValues, ValidationSchema>({
		form: options.form,
	});
	const value = field.useFieldValue();
	const meta = field.useFieldMeta();

	return (
		<fieldContext.Provider value={{ field: field as any }}>
			{typeof children === "function"
				? children?.({ form, field, value, meta })
				: children}
		</fieldContext.Provider>
	);
}

Field.displayName = "Field";

export type FieldComponent<
	FormValue,
	ParentValue = FormValue,
	ValidationSchema = DefaultValidationSchema
> = <N extends string = GetKeys<ParentValue>>(
	props: FieldProps<FormValue, ParentValue, ValidationSchema, N>
) => ReactElement;
