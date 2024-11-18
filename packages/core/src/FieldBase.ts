import type FormInstance from "src/Form";
import GlobalInstances from "src/GlobalInstances";
import type {
	FieldMeta,
	FieldOptions,
	FieldValidationOptions,
	UpdateValueOptions,
	ValidateError,
	ValidationOptions,
	ValidationResult,
	ValidationSchemaInput,
} from "src/models";
import type { GetKeys } from "src/models/Utilities";
import {
	EventListenersManager,
	clone,
	get,
	getValidationSchema,
	isEqual,
	isPathStartsWith,
	normalizeErrors,
	set,
	uniqueId,
} from "src/utilities";
import {
	type ControlledPromise,
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

	// Handle mount and unmount
	mount = () => {
		const removeField = this.form.addField(this);

		const offFormChangeValue = this.form.on("change:value", () => {
			const newValue = this.getValue();
			const oldValue = this.value;

			if (!isEqual(newValue, oldValue)) {
				this.value = newValue;
				this.setMetaKey("dirty", true);

				this.trigger("change:value", this.value, oldValue);
				this.trigger("change", this);
			}
		});

		const offThisChangeMeta = this.on("change:meta", () => {
			const { dirty, touched } = this.meta;

			dirty && this.form.setMetaKey("dirty", true);
			touched && this.form.setMetaKey("touched", true);
		});

		const offFormReset = this.form.on("reset", () => {
			this.initialize();
		});

		const offFormReInitialize = this.form.on("reInitialize", () => {
			this.initialize();
		});

		const offFormChangeMeta = this.form.on("change:meta", () => {
			const nextErrors = this.form.meta.errors.filter((error) =>
				isPathStartsWith(error.field, this.name)
			);

			if (!isEqual(this.meta.errors, nextErrors)) {
				this.setMetaKey("errors", nextErrors);
			}
		});

		return () => {
			offFormChangeValue();
			offFormReInitialize();
			offThisChangeMeta();
			offFormReset();
			removeField();
			offFormChangeMeta();
		};
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
		this.value = (this.options.initialValue ??
			clone(get(this.form.options.initialValues, this.name))) as FieldValue;

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
		this.trigger("reset");
	};

	// Handle validate
	private getValidationSchema = async (
		options: ValidationOptions
	): Promise<ValidationSchema[]> => {
		if (!this.options.validationSchema) {
			return [];
		}

		let fieldValidationSchemas =
			typeof this.options.validationSchema === "function"
				? ((await (this.options.validationSchema as Function)(this.value, {
						field: this,
						form: this.form,
				  })) as ValidationSchemaInput<ValidationSchema>)
				: this.options.validationSchema;

		return getValidationSchema(fieldValidationSchemas, options);
	};

	validate = async (
		options: FieldValidationOptions
	): Promise<ValidationResult> => {
		const validator = this.form.options.validator;

		if (!validator) {
			this.setMetaKey("errors", []);
			return Promise.resolve({ valid: true, errors: [] });
		}
		this.setMeta({
			...this.meta,
			validating: true,
			validationCount: this.meta.validationCount + 1,
		});

		this.validationPromise = createControlledPromise();
		this.validationPromise
			.finally(() => {
				this.setMetaKey("validating", false);
			})
			.catch(() => {});

		const validationSchemas = await this.getValidationSchema({
			trigger: options?.trigger,
		});

		if (validationSchemas.length === 0) {
			this.setMetaKey("errors", []);

			this.validationPromise?.resolve({
				valid: true,
				errors: [],
			});

			return this.validationPromise;
		}

		Promise.all(
			validationSchemas.map((schema) => {
				return validator.validate({
					schema,
					value: this.getValue(),
					field: this.name,
				});
			})
		)
			.then((results) => {
				if (!this.validationPromise) {
					return;
				}

				const valid = results.every((result) => result.valid);
				const syncErrorWithForm = options?.syncErrorWithForm ?? true;
				// Only get errors that are not triggered by current validation
				const filteredFormErrors = syncErrorWithForm
					? this.form.meta.errors.filter(({ trigger, field }) => {
							const isSameTrigger = options.trigger === trigger;

							return this.name !== field || !isSameTrigger;
					  })
					: [];

				if (!valid) {
					const errors = this.normalizeValidateErrors(
						results
							.filter((result) => !result.valid)
							.flatMap((result) => result.errors)
							.map((error) => {
								return {
									...error,
									trigger: options?.trigger,
								};
							})
					);

					this.setMetaKey("errors", errors);
					this.trigger("error", errors);

					if (syncErrorWithForm) {
						const mergedErrors = normalizeErrors(
							filteredFormErrors.concat(errors)
							// true
						);

						this.form.setMetaKey("errors", mergedErrors);
					}

					this.validationPromise.resolve({ valid: false, errors });
				} else {
					this.setMetaKey("errors", []);

					if (syncErrorWithForm) {
						this.form.setMetaKey("errors", filteredFormErrors);
					}

					this.validationPromise.resolve({ valid: true, errors: [] });
				}
			})
			.catch((error) => {
				if (!this.validationPromise) {
					return;
				}

				this.validationPromise.reject(error);
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
