import { GetKeys } from "src/models/Utilities";
import type {
	ValidateError,
	ValidateTrigger,
	ValidationSchemaInput,
} from "src/models/Validation";

export interface FieldMeta {
	errors?: ValidateError[];
	dirty: boolean;
	touched: boolean;
	validating: boolean;
	validationCount: number;
}

export interface FieldOptions<FieldValue, FormValues, ValidationSchema> {
	name: GetKeys<FormValues>;
	label?: string;
	initialValue?: FieldValue;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	validationSchema?:
		| ValidationSchemaInput<ValidationSchema>
		| ValidationSchemaInput<ValidationSchema>[];
	// preserveValue?: boolean;
	onChange?: (value: FieldValue) => void;
	onBlur?: (event: any) => void;
	registerInstance?: boolean;
}

export interface ValueTransformer<In = any, Out = any> {
	in: (value: In, formValues: { [key: string]: any }) => Out;
	out: (value: Out, formValues: { [key: string]: any }) => In;
}

export interface FieldArrayItemInfo {
	key: string;
	index: number;
}
