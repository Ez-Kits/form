export type ValidateTrigger = "change" | "blur";

export interface ValidationOptions {
	trigger?: ValidateTrigger | ValidateTrigger[];
}

export const GLOBAL_ERROR_FIELD = "__form_global__";

export interface ValidateError {
	/**
	 * Field name. If it is a global error, it should be "__form_global__".
	 */
	field: string;
	messages: string[];
}

export interface ValidationResult {
	valid: boolean;
	errors: ValidateError[];
}

export interface ValidatorProps<Schema> {
	schema: Schema;
	/**
	 * Will be passed at field level
	 */
	field?: string;
	value: any;
}

export type Validator<Schema> = {
	validate: (props: ValidatorProps<Schema>) => PromiseLike<ValidationResult>;
	extractSchema(schema: Schema, field: string): Schema;
};

export type ValidationSchemaInput<Schema> =
	| Schema
	| {
			trigger: ValidateTrigger;
			schema: Schema;
	  };

export type GetValidatorSchema<V> = V extends Validator<infer S> ? S : never;
