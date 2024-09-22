import type { FieldArrayInstance } from "@ez-kits/form-core";
import { createContext } from "solid-js";
import type { DefaultValidationSchema } from "src/global";

export interface FieldArrayContext<
	FieldValue = unknown,
	FormValues = unknown,
	ValidationSchema = DefaultValidationSchema
> {
	fieldArray: FieldArrayInstance<FieldValue, FormValues, ValidationSchema>;
}

const fieldArrayContext = createContext<
	FieldArrayContext<any, any, any> | undefined
>(undefined);

export default fieldArrayContext;
