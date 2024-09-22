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
import { useSyncExternalStore } from "use-sync-external-store/shim";

export function useFormInstance<
	Values,
	ValidationSchema = DefaultValidationSchema
>(formName: string) {
	return useSyncExternalStore<
		FormInstance<Values, ValidationSchema> | undefined
	>(
		(listener) => {
			return GlobalInstances.on("change", listener);
		},
		() => getFormInstance(formName),
		() => getFormInstance(formName)
	);
}

export function useFieldInstance<
	Values,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<Values> = GetKeys<Values>
>(formName: string, fieldName: N) {
	return useSyncExternalStore<
		FieldInstance<GetType<Values, N>, Values, ValidationSchema> | undefined
	>(
		(listener) => {
			return GlobalInstances.on("change", listener);
		},
		() => getFieldInstance(formName, fieldName),
		() => getFieldInstance(formName, fieldName)
	);
}

export function useFieldArrayInstance<
	Values,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<Values> = GetKeys<Values>
>(formName: string, fieldName: N) {
	return useSyncExternalStore<
		FieldArrayInstance<GetType<Values, N>, Values, ValidationSchema> | undefined
	>(
		(listener) => {
			return GlobalInstances.on("change", listener);
		},
		() => getFieldArrayInstance(formName, fieldName),
		() => getFieldArrayInstance(formName, fieldName)
	);
}
