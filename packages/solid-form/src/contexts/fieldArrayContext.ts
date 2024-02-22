import type { FieldArrayInstance } from "@ez-kits/form-core";
import { createContext } from "solid-js";

export interface FieldArrayContext<FieldValue = unknown, FormValues = unknown> {
	fieldArray: FieldArrayInstance<FieldValue, FormValues>;
}

const fieldArrayContext = createContext<FieldArrayContext | undefined>(
	undefined
);

export default fieldArrayContext;
