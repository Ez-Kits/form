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
import { splitProps, type Accessor, type JSXElement } from "solid-js";
import fieldContext from "src/contexts/fieldContext";
import type { DefaultValidationSchema } from "src/global";
import useField from "src/hooks/useField";
import { useFormPropsOrContext } from "src/hooks/useFormPropsOrContext";
import type { FieldNameProps } from "src/utilities";

export type FieldProps<
	FormValue,
	ParentValue = FormValue,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> & {
	children?:
		| JSXElement
		| ((helpers: {
				form: FormInstance<FormValue, ValidationSchema>;
				field: FieldInstance<FieldValue, FormValue, ValidationSchema>;
				value: Accessor<FieldValue>;
				meta: Accessor<FieldMeta>;
		  }) => JSXElement);
} & Omit<FieldOptions<FieldValue, FormValue, ValidationSchema>, "name"> & {
		form?: FormInstance<FormValue, ValidationSchema>;
	};

function Field<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema
>(props: FieldProps<FormValues, ParentValue, ValidationSchema>) {
	const [local, options] = splitProps(props, ["children"]);
	const form = useFormPropsOrContext<FormValues, ValidationSchema>({
		form: options.form,
	});
	const field = useField<FormValues, ParentValue, ValidationSchema>(
		options as any
	);
	const value = field.useFieldValue();
	const meta = field.useFieldMeta();

	return (
		<fieldContext.Provider value={{ field: field as any }}>
			{typeof local.children === "function"
				? local.children?.({ form, field: field, value, meta })
				: local.children}
		</fieldContext.Provider>
	);
}

Field.displayName = "Field";

export default Field;

export type FieldComponent<
	FormValue,
	ParentValue = FormValue,
	ValidationSchema = DefaultValidationSchema
> = <N extends GetKeys<ParentValue>>(
	props: FieldProps<FormValue, ParentValue, ValidationSchema, N>
) => JSXElement;
