import type {
	ValidateError,
	ValidateTrigger,
	Validator,
} from "src/models/Validation";
export interface FormMeta {
	errors: ValidateError[];
	dirty: boolean;
	touched: boolean;
	submitting: boolean;
	submissionCount: number;
	validating: boolean;
	validationCount: number;
	valid: boolean;
}

export interface FormOptions<Values, ValidationSchema> {
	name?: string;
	initialValues?: Values;
	enableReinitialize?: boolean;
	validationSchema?: ValidationSchema;
	validateTrigger?: ValidateTrigger | ValidateTrigger[];
	validator?: Validator<ValidationSchema>;
	// preserveValues?: boolean;
	onValuesChange?: (values: Values, oldValues: Values) => void;
	onReset?: () => void;
	onSubmit?: (values: Values) => void;
	onError?: (errors: ValidateError[]) => void;
	onValidate?: () => void;
}
