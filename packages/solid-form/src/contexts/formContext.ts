import type { FormInstance } from "@ez-kits/form-core";
import { createContext } from "solid-js";

export interface FormContext<FormValues = unknown> {
	form: FormInstance<FormValues>;
}

const formContext = createContext<FormContext | undefined>(undefined);

export default formContext;
