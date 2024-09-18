/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FormInstance } from "@ez-kits/form-core";
import type { DefaultValidationSchema } from "src/global";
import { getCurrentInstance, inject, provide } from "vue";

export interface InjectedFormData<
	FormValues = unknown,
	ValidationSchema = DefaultValidationSchema
> {
	form: FormInstance<FormValues, ValidationSchema>;
}

export const $formInjectKey = Symbol("ez-form-vue-form");

export function useInjectForm<
	FormValues = unknown,
	ValidationSchema = DefaultValidationSchema
>() {
	const instance = getCurrentInstance() as any;

	const injected = (instance.provides[$formInjectKey] ??
		inject($formInjectKey)) as InjectedFormData;

	if (!injected) {
		throw new Error("[useInjectForm] must be used after or inside [useForm]");
	}

	return injected.form as FormInstance<FormValues, ValidationSchema>;
}

export function provideForm<V, ValidationSchema = DefaultValidationSchema>(
	form: FormInstance<V, ValidationSchema>
) {
	provide($formInjectKey, { form });
}
