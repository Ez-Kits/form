/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FieldArrayInstance,
	type FieldArrayItemInfo,
	type FieldMeta,
	type FieldOptions,
	type GetKeys,
	type GetType,
} from "@ez-kits/form-core";
import EzField, { type FieldComponent } from "src/components/Field";
import EzFieldArray, {
	type FieldArrayComponent,
} from "src/components/FieldArray";
import type { UseField } from "src/composables/useField";
import useField from "src/composables/useField";
import {
	useFieldData,
	useFieldMeta,
	useFieldValue,
	useFieldsInfo,
	type UseFieldDataValues,
} from "src/composables/useValue";
import type { DefaultValidationSchema } from "src/global";
import { provideFieldArray } from "src/provides/fieldArray";
import { useInjectForm } from "src/provides/form";
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
} from "vue";

declare module "@ez-kits/form-core" {
	interface FieldArrayInstance<FieldValue, FormValues, ValidationSchema> {
		useField: UseField<FormValues, FieldValue, ValidationSchema>;
		useFieldArray: UseFieldArray<FormValues, FieldValue, ValidationSchema>;

		useFieldValue: <T = FieldValue>(
			selector?: (values: FieldValue) => T
		) => Ref<T>;
		useFieldMeta: <T = FieldMeta>(selector?: (meta: FieldMeta) => T) => Ref<T>;
		useFieldData: <T = UseFieldDataValues<FieldValue>>(
			selector?: (values: UseFieldDataValues<FieldValue>) => T
		) => Ref<T>;
		useFieldsInfo: () => Ref<FieldArrayItemInfo[]>;

		Field: FieldComponent<FormValues, FieldValue, ValidationSchema>;
		FieldArray: FieldArrayComponent<FormValues, FieldValue, ValidationSchema>;
	}
}

export type UseFieldArrayProps<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> &
	Omit<FieldOptions<FieldValue, FormValues, ValidationSchema>, "name">;

export default function useFieldArray<
	FormValues = unknown,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
>(
	options: MaybeRef<
		UseFieldArrayProps<FormValues, ParentValue, ValidationSchema, N>
	>
) {
	const form = useInjectForm<FormValues, ValidationSchema>();

	const name = computed(() => {
		const optionsValue = toValue(options);
		return (
			typeof optionsValue.index === "number"
				? [optionsValue.namePrefix, optionsValue.index, optionsValue.name]
				: [optionsValue.namePrefix, optionsValue.name]
		)
			.filter((d) => d !== undefined)
			.join(".");
	});

	const field = new FieldArrayInstance(form, {
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

	field.useFieldsInfo = function useFieldDataImpl() {
		return useFieldsInfo(field);
	};

	field.useField = ((props: any) => {
		return useField({
			...props,
			namePrefix: field.name,
		});
	}) as any;

	field.useFieldArray = ((props: any) => {
		return useFieldArray({
			...props,
			namePrefix: field.name,
		});
	}) as any;

	field.Field = ((props: any, { slots }: { slots: Slots }) => {
		return h(
			EzField as any,
			{
				namePrefix: field.name,
				...props,
			},
			slots
		);
	}) as any;
	field.FieldArray = ((props: any, { slots }: { slots: Slots }) => {
		return h(EzFieldArray as any, { namePrefix: field.name, ...props }, slots);
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

	provideFieldArray(field);

	return field;
}

export type UseFieldArray<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema
> = <
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
>(
	options: UseFieldArrayProps<FormValues, ParentValue, ValidationSchema, N>
) => FieldArrayInstance<FieldValue, FormValues, ValidationSchema>;
