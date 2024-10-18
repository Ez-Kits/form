/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FieldArrayInstance,
	type FieldMeta,
	type FieldOptions,
	type FormInstance,
	type GetKeys,
	type GetType,
} from "@ez-kits/form-core";
import { useEffect, useMemo, useState } from "react";
import type { FieldComponent } from "src/components/Field";
import Field from "src/components/Field";
import type { FieldArrayComponent } from "src/components/FieldArray";
import FieldArray from "src/components/FieldArray";
import type { DefaultValidationSchema } from "src/global";
import { useFormPropsOrContext } from "src/hooks/useFormPropsOrContext";
import {
	useFieldData,
	useFieldMeta,
	useFieldValue,
	type UseFieldDataValues,
} from "src/hooks/useValue";
import type { FieldNameProps } from "src/utilities";

declare module "@ez-kits/form-core" {
	interface FieldArrayInstance<FieldValue, FormValues, ValidationSchema> {
		useFieldValue: <T = FieldValue>(selector?: (values: FieldValue) => T) => T;
		useFieldMeta: <T = FieldMeta>(selector?: (meta: FieldMeta) => T) => T;
		useFieldData: <T = UseFieldDataValues<FieldValue>>(
			selector?: (values: UseFieldDataValues<FieldValue>) => T
		) => T;

		Field: FieldComponent<FormValues, FieldValue, ValidationSchema>;
		FieldArray: FieldArrayComponent<FormValues, FieldValue, ValidationSchema>;
	}
}

export type UseFieldArrayProps<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends string = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> &
	Omit<
		FieldOptions<FieldValue, FormValues, ValidationSchema>,
		"name" | "valuePropName" | "onChangePropName" | "onBlurPropName"
	> & {
		form?: FormInstance<FormValues, ValidationSchema>;
	};

export default function useFieldArray<
	FormValues = unknown,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
>(options: UseFieldArrayProps<FormValues, ParentValue, ValidationSchema, N>) {
	const form = useFormPropsOrContext<FormValues, ValidationSchema>({
		form: options.form,
	});

	const name = useMemo(() => {
		const { index, namePrefix, name } = options as any;

		return (
			typeof index === "number" ? [namePrefix, index, name] : [namePrefix, name]
		)
			.filter((d) => d !== undefined)
			.join(".");
	}, [options]);

	const [field] = useState(() => {
		const fieldInstance = new FieldArrayInstance(form, {
			...options,
			name: name as any,
		});

		fieldInstance.mount();

		fieldInstance.useFieldValue = function useFieldValueImpl(selector) {
			return useFieldValue(fieldInstance, selector);
		};

		fieldInstance.useFieldMeta = function useFieldMetaImpl(selector) {
			return useFieldMeta(fieldInstance, selector);
		};

		fieldInstance.useFieldData = function useFieldDataImpl(selector) {
			return useFieldData(fieldInstance, selector);
		};

		fieldInstance.Field = (props) => {
			return (
				<Field
					namePrefix={fieldInstance.name}
					form={form}
					{...(props as any)}
				/>
			);
		};
		fieldInstance.FieldArray = (props) => {
			return (
				<FieldArray
					namePrefix={fieldInstance.name}
					form={form}
					{...(props as any)}
				/>
			);
		};

		return fieldInstance;
	});
	field.updateOptions({
		...options,
		name: name as any,
	});

	useEffect(() => {
		return field.mount();
	}, [field]);

	return field;
}

export type UseFieldArray<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema
> = <
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue extends any[] = GetType<ParentValue, N> & []
>(
	options: UseFieldArrayProps<FormValues, ParentValue, ValidationSchema, N>
) => FieldArrayInstance<FieldValue, FormValues, ValidationSchema>;
