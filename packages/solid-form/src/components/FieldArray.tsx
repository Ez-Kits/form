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
import { splitProps, type Accessor, type JSXElement } from "solid-js";
import fieldArrayContext from "src/contexts/fieldArrayContext";
import type { DefaultValidationSchema } from "src/global";
import useFieldArray from "src/hooks/useFieldArray";
import { useFormPropsOrContext } from "src/hooks/useFormPropsOrContext";
import type { FieldNameProps } from "src/utilities";

export type FieldArrayProps<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends string = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> & {
	children?:
		| JSXElement
		| ((helpers: {
				form: FormInstance<FormValues, ValidationSchema>;
				fieldArray: FieldArrayInstance<
					FieldValue,
					FormValues,
					ValidationSchema
				>;
				fieldsInfo: Accessor<FieldArrayItemInfo[]>;
				value: Accessor<FieldValue>;
				meta: Accessor<FieldMeta>;
		  }) => JSXElement);
} & Omit<FieldOptions<FieldValue, FormValues, ValidationSchema>, "name"> & {
		form?: FormInstance<FormValues, ValidationSchema>;
	};

function FieldArray<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema
>(props: FieldArrayProps<FormValues, ParentValue, ValidationSchema>) {
	const [local, options] = splitProps(props, ["children"]);
	const fieldArray = useFieldArray<FormValues, ParentValue, ValidationSchema>(
		options as any
	);
	const form = useFormPropsOrContext<FormValues, ValidationSchema>({
		form: options.form,
	});
	const fieldsInfo = fieldArray.useFieldValue(() => fieldArray.getFieldsInfo());
	const value = fieldArray.useFieldValue();
	const meta = fieldArray.useFieldMeta();

	return (
		<fieldArrayContext.Provider value={{ fieldArray }}>
			{typeof local.children === "function"
				? local.children?.({
						form,
						fieldArray,
						fieldsInfo,
						value,
						meta,
				  })
				: local.children}
		</fieldArrayContext.Provider>
	);
}

FieldArray.displayName = "FieldArray";

export default FieldArray;

export type FieldArrayComponent<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema
> = <N extends string = GetKeys<ParentValue>>(
	props: FieldArrayProps<FormValues, ParentValue, ValidationSchema, N>
) => JSXElement;
