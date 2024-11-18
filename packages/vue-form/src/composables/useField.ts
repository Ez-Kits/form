/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FieldInstance,
	FormInstance,
	type FieldMeta,
	type FieldOptions,
	type GetKeys,
	type GetType,
} from "@ez-kits/form-core";
import EzField, { type FieldComponent } from "src/components/Field";
import EzFieldArray, {
	type FieldArrayComponent,
} from "src/components/FieldArray";
import type { UseFieldArray } from "src/composables/useFieldArray";
import useFieldArray from "src/composables/useFieldArray";
import { useFormPropsOrInjected } from "src/composables/useFormPropsOrInjected";
import {
	useFieldData,
	useFieldMeta,
	useFieldValue,
	type UseFieldDataValues,
} from "src/composables/useValue";
import type { DefaultValidationSchema } from "src/global";
import { provideField } from "src/provides/field";
import type { FieldNameProps } from "src/utilities/field";
import {
	computed,
	h,
	onBeforeUnmount,
	toValue,
	watch,
	type MaybeRef,
	type Ref,
	type Slots,
	type VNode,
} from "vue";

declare module "@ez-kits/form-core" {
	interface FieldInstance<FieldValue, FormValues, ValidationSchema> {
		useField: UseField<FormValues, FieldValue, ValidationSchema>;
		useFieldArray: UseFieldArray<FormValues, FieldValue, ValidationSchema>;

		getInputProps(node: VNode): Record<string, any>;
		useFieldValue: <T = FieldValue>(
			selector?: (values: FieldValue) => T
		) => Ref<T>;
		useFieldMeta: <T = FieldMeta>(selector?: (meta: FieldMeta) => T) => Ref<T>;
		useFieldData: <T = UseFieldDataValues<FieldValue>>(
			selector?: (values: UseFieldDataValues<FieldValue>) => T
		) => Ref<T>;

		Field: FieldComponent<FormValues, FieldValue, ValidationSchema>;
		FieldArray: FieldArrayComponent<FormValues, FieldValue, ValidationSchema>;
	}

	interface FieldOptions<FieldValue, FormValues, ValidationSchema> {
		valuePropName?: string;
		onChangePropName?: string;
		onBlurPropName?: string;
		namePrefix?: string;
	}
}

export type UseFieldProps<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> &
	Omit<FieldOptions<FieldValue, FormValues, ValidationSchema>, "name"> & {
		form?: FormInstance<FormValues, ValidationSchema>;
	};

export default function useField<
	FormValues = unknown,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
>(
	options: MaybeRef<UseFieldProps<FormValues, ParentValue, ValidationSchema, N>>
) {
	const form = useFormPropsOrInjected<FormValues, ValidationSchema>({
		form: toValue(options).form,
	});

	const name = computed(() => {
		const optionsValue = toValue(options);
		return [optionsValue.namePrefix, optionsValue.name]
			.filter((d) => d !== undefined)
			.join(".");
	});

	const field = new FieldInstance(form, {
		...toValue(options),
		name: name.value as any,
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

	field.getInputProps = (node) => {
		if (
			!node.component &&
			["input", "textarea", "select"].includes(String(node.type).toLowerCase())
		) {
			return {
				value: field.getValue(),
				onChange: (e: any) => field.handleChange(e),
				onInput: (e: any) => field.handleChange(e),
				onBlur: (e: Event) => field.handleBlur(e),
				get name() {
					return `${form.uid}-${field.name as string}`;
				},
				get id() {
					return `${form.uid}-${field.name as string}`;
				},
			};
		}

		const { valuePropName = "value", onBlurPropName = "onBlur" } =
			field.options;
		let { onChangePropName } = field.options;

		if (!onChangePropName) {
			onChangePropName = `onUpdate:${valuePropName}`;
		}

		return {
			[valuePropName]: field.getValue(),
			[onChangePropName]: (e: any) => {
				return field.handleChange(e);
			},
			[onBlurPropName]: (e: Event) => {
				return field.handleBlur(e);
			},
			get name() {
				return `${form.uid}-${field.name as string}`;
			},
			get id() {
				return `${form.uid}-${field.name as string}`;
			},
		};
	};

	field.useField = ((props: any) => {
		return useField({
			namePrefix: field.name,
			form: form,
			...props,
		});
	}) as any;

	field.useFieldArray = ((props: any) => {
		return useFieldArray({
			namePrefix: field.name,
			form: form,
			...props,
		});
	}) as any;

	field.Field = ((props: any, { slots }: { slots: Slots }) => {
		return h(
			EzField as any,
			{
				namePrefix: field.name,
				form: form,
				...props,
			},
			slots
		);
	}) as any;
	field.FieldArray = ((props: any, { slots }: { slots: Slots }) => {
		return h(
			EzFieldArray as any,
			{
				namePrefix: field.name,
				form: form,
				...props,
			},
			slots
		);
	}) as any;

	watch(
		() => toValue(options),
		(newOptions) => {
			field.updateOptions({
				...newOptions,
				name: name.value as any,
			});
		}
	);

	const unmount = field.mount();

	onBeforeUnmount(() => {
		unmount();
	});

	provideField(field);

	return field;
}

export type UseField<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema
> = <
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
>(
	options: UseFieldProps<FormValues, ParentValue, ValidationSchema, N>
) => FieldInstance<FieldValue, FormValues, ValidationSchema>;
