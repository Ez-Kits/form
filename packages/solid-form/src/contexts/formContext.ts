import type { FormInstance } from "@ez-kits/form-core";
import { createContext } from "solid-js";
import type { DefaultValidationSchema } from "src/global";

export interface FormContext<
	FormValues = unknown,
	ValidationSchema = DefaultValidationSchema
> {
	form: FormInstance<FormValues, ValidationSchema>;
}

const formContext = createContext<FormContext<any, any> | undefined>(undefined);

export default formContext;
