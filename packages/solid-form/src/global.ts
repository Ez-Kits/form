import type { GetValidatorSchema, Validator } from "@ez-kits/form-core";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GlobalRegister {}

export type GlobalValidator = GlobalRegister extends { validator: infer V }
	? V
	: unknown;

export type DefaultValidationSchema =
	GetValidatorSchema<GlobalValidator> extends never
		? unknown
		: GetValidatorSchema<GlobalValidator>;

export let globalValidator: GlobalValidator = undefined;

export function registerGlobalValidator<V>(validator: Validator<V>) {
	globalValidator = validator;
}
