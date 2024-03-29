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
import useField from "src/hooks/useField";
import useFormContext from "src/hooks/useFormContext";
import type { FieldNameProps } from "src/utilities";

export type FieldProps<
	FormValue,
	ParentValue = FormValue,
	N extends string = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> & {
	children?:
		| ReactNode
		| ((helpers: {
				form: FormInstance<FormValue>;
				field: FieldInstance<FieldValue, FormValue>;
				value: FieldValue;
				meta: FieldMeta;
		  }) => ReactNode);
} & Omit<FieldOptions<FieldValue, FormValue>, "name">;

export default function Field<FormValues, ParentValue = FormValues>({
	children,
	...options
}: FieldProps<FormValues, ParentValue>) {
	const field = useField<FormValues, ParentValue>(options as any);
	const form = useFormContext<FormValues>();
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

export type FieldComponent<FormValue, ParentValue = FormValue> = (
	props: FieldProps<FormValue, ParentValue>
) => ReactElement;
