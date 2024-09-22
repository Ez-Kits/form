import type { FieldInstance } from "@ez-kits/form-core";
import { useContext } from "react";
import fieldContext from "src/contexts/fieldContext";
import type { DefaultValidationSchema } from "src/global";

export default function useFieldContext<
	FieldValue = unknown,
	FormValues = unknown,
	ValidationSchema = DefaultValidationSchema
>() {
	const context = useContext(fieldContext);

	if (!context) {
		throw new Error("[useFieldContext] must be used in fieldContext.Provider");
	}

	return context.field as FieldInstance<
		FieldValue,
		FormValues,
		ValidationSchema
	>;
}
