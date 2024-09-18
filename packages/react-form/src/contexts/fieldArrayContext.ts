import type { FieldArrayInstance } from "@ez-kits/form-core";
import { createContext } from "react";
import type { DefaultValidationSchema } from "src/global";

export interface FieldArrayContext<
	FieldValues = unknown,
	FormValues = unknown,
	ValidationSchema = DefaultValidationSchema
> {
	fieldArray: FieldArrayInstance<FieldValues, FormValues, ValidationSchema>;
}

const fieldArrayContext = createContext<
	FieldArrayContext<any, any, any> | undefined
>(undefined);

export default fieldArrayContext;
