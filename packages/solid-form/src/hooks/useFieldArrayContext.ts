import type { FieldArrayInstance } from "@ez-kits/form-core";
import { useContext } from "solid-js";
import fieldArrayContext from "src/contexts/fieldArrayContext";

export default function useFieldArrayContext<
	FieldValue = unknown,
	FormValues = unknown
>() {
	const context = useContext(fieldArrayContext);

	if (!context) {
		throw new Error(
			"[useFieldArrayContext] must be used in fieldArrayContext.Provider"
		);
	}

	return context.fieldArray as FieldArrayInstance<FieldValue, FormValues>;
}
