/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FieldArrayInstance,
	type FieldArrayItemInfo,
	type FieldMeta,
	type FieldOptions,
	type FormInstance,
	type GetKeys,
	type GetType,
} from "@ez-kits/form-core";
import {
	createEffect,
	createMemo,
	on,
	onCleanup,
	type Accessor,
} from "solid-js";
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
		useFieldValue: <T = FieldValue>(
			selector?: (values: FieldValue) => T
		) => Accessor<T>;
		useFieldMeta: <T = FieldMeta>(
			selector?: (meta: FieldMeta) => T
		) => Accessor<T>;
		useFieldData: <T = UseFieldDataValues<FieldValue>>(
			selector?: (values: UseFieldDataValues<FieldValue>) => T
		) => Accessor<T>;
		useFieldsInfo: () => Accessor<FieldArrayItemInfo[]>;
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
	Omit<FieldOptions<FieldValue, FormValues, ValidationSchema>, "name"> & {
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

	const name = createMemo(() => {
		const { namePrefix, name } = options;

		return [namePrefix, name].filter((d) => d !== undefined).join(".");
	});

	const field = new FieldArrayInstance(form, {
		...options,
		name: name() as any,
	});

	field.useFieldValue = function useFieldValueImpl(selector) {
		return useFieldValue(field, selector);
	};

	field.useFieldMeta = function useFieldMetaImpl(selector) {
		return useFieldMeta(field, selector);
	};

	field.useFieldData = function useFieldDataImpl(selector) {
		return useFieldData(field, selector);
	};

	field.useFieldsInfo = function useFieldInfoImpl() {
		return useFieldData(field, () => field.getFieldsInfo());
	};

	field.Field = (props) => {
		return <Field namePrefix={field.name} form={form} {...(props as any)} />;
	};
	field.FieldArray = (props) => {
		return (
			<FieldArray namePrefix={field.name} form={form} {...(props as any)} />
		);
	};

	createEffect(
		on(
			() => options,
			() => {
				field.updateOptions({ ...options, name: name() as any });
			}
		)
	);

	createEffect(() => {
		const unmount = field.mount();
		onCleanup(unmount);
	}, [field]);

	return field;
}

export type UseFieldArray<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema
> = <
	N extends GetKeys<ParentValue>,
	FieldValue extends any[] = GetType<ParentValue, N> & []
>(
	options: UseFieldArrayProps<FormValues, ParentValue, ValidationSchema, N>
) => FieldArrayInstance<FieldValue, FormValues, ValidationSchema>;
