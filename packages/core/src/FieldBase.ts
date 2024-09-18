import type FormInstance from "src/Form";
import GlobalInstances from "src/GlobalInstances";
import {
	FieldMeta,
	FieldOptions,
	UpdateValueOptions,
	ValidateError,
	ValidationOptions,
	ValidationResult,
	ValidationSchemaInput,
} from "src/models";
import { GetKeys } from "src/models/Utilities";
import {
	EventListenersManager,
	clone,
	get,
	set,
	uniqueId,
} from "src/utilities";
import { toArray } from "src/utilities/array";
import {
	ControlledPromise,
	createControlledPromise,
} from "src/utilities/promise";

export type DefaultFieldEvents<Value> = {
	change: [field: any];
	"change:value": [value: Value, oldValue: Value];
	"change:meta": [meta: FieldMeta];
	error: [errors: ValidateError[]];
	reset: [];
};

export default abstract class FieldBaseInstance<
	FieldValue,
	FormValues,
	ValidationSchema,
	FieldEvents extends DefaultFieldEvents<FieldValue> = DefaultFieldEvents<FieldValue>
> extends EventListenersManager<FieldEvents> {
	protected managerName = "Field";

	name!: GetKeys<FormValues>;
	value!: FieldValue;
	protected form: FormInstance<FormValues, ValidationSchema>;
	options!: FieldOptions<FieldValue, FormValues, ValidationSchema>;
	meta!: FieldMeta;
	uid: string = uniqueId();
	protected validationPromise?: ControlledPromise<ValidationResult>;

	constructor(
		form: FormInstance<FormValues, ValidationSchema>,
		options: FieldOptions<FieldValue, FormValues, ValidationSchema>
	) {
		super();
		this.form = form;
		this.name = options.name;
		this.options = options;
		this.initialize(false);
	}

	abstract mount(): () => void;

	initialize = (notify = true) => {
		this.name = this.options.name;
		const oldValue = this.value;
		this.value = (clone(get(this.form.values, this.name)) ??
			this.options.initialValue) as FieldValue;

		this.form.setFieldValue(this.name, this.value as any, {
			validate: false,
			dirty: false,
			touched: false,
		});

		this.meta = {
			dirty: false,
			touched: false,
			errors: undefined,
			validating: false,
			validationCount: 0,
		};

		this.cancelValidate();

		if (notify) {
			this.trigger("change:value", this.value, oldValue);
			this.trigger("change", this);
			this.trigger("change:meta", this.meta);
		}
	};

	updateOptions = (
		options: FieldOptions<FieldValue, FormValues, ValidationSchema>
	) => {
		if (this.options.name !== options.name) {
			const oldName = this.name;
			this.name = options.name;
			GlobalInstances.renameField(this.form.name, oldName, this.name);
		}

		this.options = options;

		if (this.name !== options.name) {
			this.initialize();
		}
	};

	// Handle meta
	setMeta = (value: FieldMeta) => {
		this.meta = value;
		this.trigger("change:meta", value);
		this.trigger("change", this);
	};

	setMetaKey = <K extends keyof FieldMeta>(key: K, value: FieldMeta[K]) => {
		set(this.meta, key, value);
		this.trigger("change:meta", this.meta);
		this.trigger("change", this);
	};

	// Handle value
	getValue = (): FieldValue => {
		return this.form.getFieldValue(this.name) as FieldValue;
	};

	setValue = (value: FieldValue, options?: UpdateValueOptions) => {
		const oldValue = this.value;
		const newValue = value;
		this.value = newValue;

		this.form.setFieldValue(this.name, newValue as any, options);
		options?.touched && this.setMetaKey("touched", true);
		options?.dirty && this.setMetaKey("dirty", true);

		this.trigger("change:value", this.value, oldValue);
		this.trigger("change", this);
	};

	// Handle reset
	reset = () => {
		this.initialize();
		this.trigger("reset");
	};

	// Handle validate
	private getValidationSchema = (
		options: ValidationOptions
	): ValidationSchemaInput<ValidationSchema>[] => {
		if (!this.options.validationSchema) {
			return [];
		}

		if (!options.trigger) {
			return toArray(this.options.validationSchema);
		}

		const schemas = toArray(this.options.validationSchema);
		const filteredSchemas = schemas.filter((schema) => {
			if (schema && typeof schema === "object" && "trigger" in schema) {
				return schema.trigger === options.trigger;
			}

			return true;
		});

		if (this.form.options.validator && this.form.options.validationSchema) {
			filteredSchemas.push(
				this.form.options.validator.extractSchema(
					this.form.options.validationSchema,
					this.name
				)
			);
		}

		return filteredSchemas;
	};

	validate = async (options?: ValidationOptions): Promise<ValidationResult> => {
		const validator = this.form.options.validator;

		if (!validator) {
			this.setMetaKey("errors", []);
			return Promise.resolve({ valid: true, errors: [] });
		}

		this.setMetaKey("validationCount", this.meta.validationCount + 1);
		this.setMetaKey("validating", true);

		this.validationPromise = createControlledPromise();
		this.validationPromise
			.then(() => {
				this.setMetaKey("validating", false);
			})
			.catch(() => {
				this.setMetaKey("validating", false);
			});

		const validationSchemas = this.getValidationSchema({
			trigger: options?.trigger,
		});

		if (validationSchemas.length === 0) {
			this.validationPromise.resolve({ valid: true, errors: [] });
			return this.validationPromise;
		}

		Promise.all(
			validationSchemas.map((schema) => {
				return validator.validate({
					schema:
						typeof schema === "object" && schema && "trigger" in schema
							? schema.schema
							: schema,
					value: this.getValue(),
					field: this.name,
				});
			})
		).then((results) => {
			if (!this.validationPromise) {
				return;
			}

			const valid = results.every((result) => result.valid);
			if (!valid) {
				const errors = this.normalizeValidateErrors(
					results
						.filter((result) => !result.valid)
						.flatMap((result) => result.errors)
				);

				this.setMetaKey("errors", errors);
				this.trigger("error", errors);

				this.validationPromise.resolve({ valid: false, errors });
			} else {
				this.setMetaKey("errors", []);
				this.validationPromise.resolve({ valid: true, errors: [] });
			}
		});

		return this.validationPromise;
	};

	cancelValidate = () => {
		if (!this.validationPromise) {
			return;
		}

		this.validationPromise.reject({ cancelled: true });
		this.validationPromise = undefined;
	};

	clearValidate = () => {
		this.cancelValidate();
		this.setMetaKey("errors", []);
	};

	normalizeValidateErrors(errors: ValidateError[]) {
		return errors.map((error) => {
			return {
				...error,
				messages: this.options.label
					? error.messages.map((message) => {
							return message.replace(
								new RegExp(this.name, "g"),
								this.options.label ?? ""
							);
					  })
					: error.messages,
			};
		});
	}
}
