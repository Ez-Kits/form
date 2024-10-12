import type { ToEvent } from "src/models/Utilities";

export type ValidateTrigger = "change" | "blur" | "submit";

export interface ValidationOptions {
	trigger: ValidateTrigger;
}

export const GLOBAL_ERROR_FIELD = "__form_global__";

export interface ValidateError {
	/**
	 * Field name. If it is a global error, it should be "__form_global__".
	 */
	field: string;
	messages: string[];
	trigger: ValidateTrigger;
}

export interface ValidationResult {
	valid: boolean;
	errors: ValidateError[];
}

export type ValidationResultOrEmptySchema =
	| ValidationResult
	| { emptySchema: true };

export interface ValidatorProps<Schema> {
	schema: Schema;
	/**
	 * Will be passed at field level
	 */
	field?: string;
	value: any;
}

export interface ValidatorResult {
	valid: boolean;
	errors: Omit<ValidateError, "trigger">[];
}

export type Validator<Schema> = {
	validate: (props: ValidatorProps<Schema>) => PromiseLike<ValidatorResult>;
};

export type ValidationSchemaRecord<Schema> = {
	[trigger in ToEvent<ValidateTrigger>]?: Schema | Schema[];
};
export type ValidationSchemaArrayRecord<Schema> = {
	[trigger in ToEvent<ValidateTrigger>]?: Schema[];
};

export type ValidationSchemaInput<Schema> =
	| Schema
	| Schema[]
	| ValidationSchemaRecord<Schema>;

export type GetValidatorSchema<V> = V extends Validator<infer S> ? S : never;
