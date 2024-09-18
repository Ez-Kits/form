import type { FormInstance } from "@ez-kits/form-core";
import { useContext } from "react";
import formContext from "src/contexts/formContext";
import type { DefaultValidationSchema } from "src/global";

export default function useFormContext<
	FormValues = unknown,
	ValidationSchema = DefaultValidationSchema
>(): FormInstance<FormValues, ValidationSchema> {
	const context = useContext(formContext);

	if (!context) {
		throw new Error("[useFormContext] must be used in formContext.Provider");
	}

	return context.form as FormInstance<FormValues, ValidationSchema>;
}
