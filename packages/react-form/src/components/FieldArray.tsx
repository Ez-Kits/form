/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type {
	FieldArrayInstance,
	FieldArrayItemInfo,
	FieldMeta,
	FieldOptions,
	FormInstance,
	GetKeys,
	GetType,
} from "@ez-kits/form-core";
import { type ReactElement, type ReactNode } from "react";
import fieldArrayContext from "src/contexts/fieldArrayContext";
import type { DefaultValidationSchema } from "src/global";
import useFieldArray from "src/hooks/useFieldArray";
import { useFormPropsOrContext } from "src/hooks/useFormPropsOrContext";
import type { FieldNameProps } from "src/utilities";

export type FieldArrayProps<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> & {
	children?:
		| ReactNode
		| ((helpers: {
				form: FormInstance<FormValues, ValidationSchema>;
				fieldArray: FieldArrayInstance<
					FieldValue,
					FormValues,
					ValidationSchema
				>;
				fieldsInfo: FieldArrayItemInfo[];
				value: FieldValue;
				meta: FieldMeta;
		  }) => ReactNode);
} & Omit<
		FieldOptions<FieldValue, FormValues, ValidationSchema>,
		"name" | "valuePropName" | "onChangePropName" | "onBlurPropName"
	> & {
		form?: FormInstance<FormValues, ValidationSchema>;
	};

function FieldArray<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema
>({
	children,
	...options
}: FieldArrayProps<FormValues, ParentValue, ValidationSchema>) {
	const fieldArray = useFieldArray<FormValues, ParentValue, ValidationSchema>(
		options as any
	);
	const form = useFormPropsOrContext<FormValues, ValidationSchema>({
		form: options.form,
	});
	const value = fieldArray.useFieldValue();
	const meta = fieldArray.useFieldMeta();

	return (
		<fieldArrayContext.Provider value={{ fieldArray: fieldArray as any }}>
			{typeof children === "function"
				? children?.({
						form,
						fieldArray: fieldArray as any,
						fieldsInfo: fieldArray.getFieldsInfo(),
						value,
						meta,
				  })
				: children}
		</fieldArrayContext.Provider>
	);
}

FieldArray.displayName = "FieldArray";

export default FieldArray;

export type FieldArrayComponent<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema
> = <N extends GetKeys<ParentValue>>(
	props: FieldArrayProps<FormValues, ParentValue, ValidationSchema, N>
) => ReactElement;
