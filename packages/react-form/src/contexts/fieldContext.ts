import type { FieldInstance } from "@ez-kits/form-core";
import { createContext } from "react";

export interface FieldContext<FieldValues = unknown, FormValues = unknown> {
	field: FieldInstance<FieldValues, FormValues>;
}

const fieldContext = createContext<FieldContext | undefined>(undefined);

export default fieldContext;
