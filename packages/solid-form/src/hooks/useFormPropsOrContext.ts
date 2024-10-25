import type { FormInstance } from "@ez-kits/form-core";
import type { DefaultValidationSchema } from "src/global";
import useFormContext from "src/hooks/useFormContext";

export interface UseFormPropsOrContextProps<
	FormValues,
	ValidationSchema = DefaultValidationSchema
> {
	form?: FormInstance<FormValues, ValidationSchema>;
}

export function useFormPropsOrContext<
	FormValues,
	ValidationSchema = DefaultValidationSchema
>({
	form: inputForm,
}: UseFormPropsOrContextProps<FormValues, ValidationSchema>): FormInstance<
	FormValues,
	ValidationSchema
> {
	const contextForm = useFormContextOrUndefined<FormValues, ValidationSchema>();
	const form = inputForm || contextForm;

	if (!form) {
		throw new Error("You have to provide a form instance via props or context");
	}

	return form;
}

function useFormContextOrUndefined<
	FormValues,
	ValidationSchema = DefaultValidationSchema
>() {
	try {
		const contextForm = useFormContext<FormValues, ValidationSchema>();

		return contextForm;
	} catch {
		return undefined;
	}
}
