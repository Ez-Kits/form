import type { FormInstance } from "@ez-kits/form-core";
import type { DefaultValidationSchema } from "src/global";
import { useInjectForm } from "src/provides/form";

export interface UseFormPropsOrContextProps<
	FormValues,
	ValidationSchema = DefaultValidationSchema
> {
	form?: FormInstance<FormValues, ValidationSchema>;
}

export function useFormPropsOrInjected<
	FormValues,
	ValidationSchema = DefaultValidationSchema
>({
	form: inputForm,
}: UseFormPropsOrContextProps<FormValues, ValidationSchema>): FormInstance<
	FormValues,
	ValidationSchema
> {
	if (inputForm) {
		return inputForm;
	}

	return useInjectForm();
}
