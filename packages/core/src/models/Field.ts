import type FieldInstance from "src/Field";
import type FieldArrayInstance from "src/FieldArray";
import type FormInstance from "src/Form";
import type { GetKeys } from "src/models/Utilities";
import type {
	ValidateError,
	ValidateTrigger,
	ValidationOptions,
	ValidationSchemaInput,
} from "src/models/Validation";

export interface FieldMeta {
	errors?: ValidateError[];
	dirty: boolean;
	touched: boolean;
	validating: boolean;
	validationCount: number;
}

export type FieldValidationSchemaFunction<
	FieldValue,
	FormValues,
	ValidationSchema
> = (
	value: FieldValue,
	otherInfo: {
		field: FieldValue extends any[]
			? FieldArrayInstance<FieldValue, FormValues, ValidationSchema>
			: FieldInstance<FieldValue, FormValues, ValidationSchema>;
		form: FormInstance<FormValues, ValidationSchema>;
	}
) =>
	| PromiseLike<ValidationSchemaInput<ValidationSchema>>
	| ValidationSchemaInput<ValidationSchema>;

export interface FieldOptions<FieldValue, FormValues, ValidationSchema> {
	name: GetKeys<FormValues>;
	label?: string;
	initialValue?: FieldValue;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	validationSchema?:
		| ValidationSchemaInput<ValidationSchema>
		| FieldValidationSchemaFunction<FieldValue, FormValues, ValidationSchema>;
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

export interface FieldValidationOptions extends ValidationOptions {
	/**
	 * Should sync errors with form.
	 * @default true
	 */
	syncErrorWithForm?: boolean;
}
