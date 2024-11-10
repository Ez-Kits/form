/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FieldArrayItemInfo } from "@ez-kits/form-core";
import {
	FieldArrayInstance,
	FormInstance,
	type FieldOptions,
	type GetKeys,
} from "@ez-kits/form-core";
import useFieldArray from "src/composables/useFieldArray";
import type { DefaultValidationSchema } from "src/global";
import { useInjectForm } from "src/provides/form";
import { fieldArrayProps, type FieldNameProps } from "src/utilities/field";
import { defineComponent, getCurrentInstance } from "vue";

export type FieldArrayProps<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
> = FieldNameProps<ParentValue, N> &
	Omit<
		FieldOptions<any, FormValues, ValidationSchema>,
		"name" | "valuePropName" | "onChangePropName" | "onBlurPropName"
	> & {
		form?: FormInstance<FormValues, ValidationSchema>;
	};

const FieldArrayImpl = defineComponent({
	name: "EzFieldArray",
	props: fieldArrayProps(),
	setup(props, ctx) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const fieldArray = useFieldArray(props as any);
		const form = props.form || useInjectForm();
		const fieldsInfo = fieldArray.useFieldsInfo();

		const componentInstance = getCurrentInstance();
		if (componentInstance) {
			fieldArray.uid = componentInstance.uid.toString();
		}

		return () =>
			ctx.slots.default?.({
				fieldArray,
				form,
				fieldsInfo: fieldsInfo.value,
			});
	},
});

const EzFieldArray = FieldArrayImpl as unknown as FieldArrayComponent<any>;

export default EzFieldArray;

type BaseFieldArrayType = typeof FieldArrayImpl;

export type FieldArrayInstanceForSlot<FormValues, ValidationSchema> = Omit<
	FieldArrayInstance<any, FormValues, ValidationSchema>,
	| "Field"
	| "FieldArray"
	| "useFieldMeta"
	| "useFieldValue"
	| "useFieldData"
	| "useFieldsInfo"
>;

export type FieldArrayComponent<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
> = Omit<BaseFieldArrayType, "$props"> & {
	new (): {
		$props: FieldArrayProps<FormValues, ParentValue, ValidationSchema, N>;
		$slots: {
			default: (helpers: {
				form: FormInstance<FormValues, ValidationSchema>;
				fieldArray: FieldArrayInstanceForSlot<FormValues, ValidationSchema>;
				fieldsInfo: FieldArrayItemInfo[];
			}) => any;
		};
	};
};
