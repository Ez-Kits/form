import {
	FieldArrayInstance,
	FieldInstance,
	FormInstance,
	GlobalInstances,
	getFieldArrayInstance,
	getFieldInstance,
	getFormInstance,
	type GetKeys,
	type GetType,
} from "@ez-kits/form-core";
import type { DefaultValidationSchema } from "src/global";
import { ref, type Ref } from "vue";

export function useFormInstance<
	Values,
	ValidationSchema = DefaultValidationSchema
>(formName: string) {
	const instance = ref<FormInstance<Values, ValidationSchema> | undefined>(
		getFormInstance(formName)
	) as Ref<FormInstance<Values, ValidationSchema> | undefined>;

	GlobalInstances.on("change", () => {
		instance.value = getFormInstance(formName);
	});

	return instance;
}

export function useFieldInstance<
	Values,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<Values> = GetKeys<Values>
>(formName: string, fieldName: N) {
	const instance = ref<
		FieldInstance<GetType<Values, N>, Values, ValidationSchema> | undefined
	>(getFieldInstance(formName, fieldName)) as Ref<
		FieldInstance<GetType<Values, N>, Values, ValidationSchema> | undefined
	>;
	GlobalInstances.on("change", () => {
		instance.value = getFieldInstance(formName, fieldName);
	});

	return instance;
}

export function useFieldArrayInstance<
	Values,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<Values> = GetKeys<Values>
>(formName: string, fieldName: N) {
	const instance = ref<
		FieldArrayInstance<GetType<Values, N>, Values, ValidationSchema> | undefined
	>(getFieldArrayInstance(formName, fieldName)) as Ref<
		FieldArrayInstance<GetType<Values, N>, Values, ValidationSchema> | undefined
	>;
	GlobalInstances.on("change", () => {
		instance.value = getFieldArrayInstance(formName, fieldName);
	});

	return instance;
}
