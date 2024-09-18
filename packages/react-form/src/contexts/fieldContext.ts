import type { FieldInstance } from "@ez-kits/form-core";
import { createContext } from "react";
import type { DefaultValidationSchema } from "src/global";

export interface FieldContext<
	FieldValues = unknown,
	FormValues = unknown,
	ValidationSchema = DefaultValidationSchema
> {
	field: FieldInstance<FieldValues, FormValues, ValidationSchema>;
}

const fieldContext = createContext<FieldContext<any, any, any> | undefined>(
	undefined
);

export default fieldContext;
