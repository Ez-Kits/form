import type FieldBaseInstance from "src/FieldBase";
import GlobalInstances from "src/GlobalInstances";
import {
	FormMeta,
	FormOptions,
	UpdateValueOptions,
	ValidateError,
	ValidationOptions,
	ValidationResult,
} from "src/models";
import { GetKeys, GetType } from "src/models/Utilities";
import {
	EventListenersManager,
	clone,
	get,
	getValidationSchema,
	isEqual,
	normalizeErrors,
	set,
	uniqueId,
} from "src/utilities";
import { toArray } from "src/utilities/array";
import { ControlledPromise } from "src/utilities/promise";

type FormEvents<Values, ValidationInput> = {
	change: [form: FormInstance<Values, ValidationInput>];
	"change:value": [values: Values, oldValues: Values];
	"change:meta": [meta: FormMeta, oldMeta: FormMeta];
	reset: [];
	submit: [values: Values];
	error: [errors: ValidateError[]];
	reInitialize: [];
	validate: [];
};

export default class FormInstance<
	Values,
	ValidationSchema
> extends EventListenersManager<FormEvents<Values, ValidationSchema>> {
	protected managerName = "Form";

	uid: string = uniqueId();
	name!: string;
	values!: Values;
	meta!: FormMeta;
	options: FormOptions<Values, ValidationSchema>;
	private fields: Set<FieldBaseInstance<any, Values, ValidationSchema>> =
		new Set([]);

	private validationPromise?: ControlledPromise<ValidationResult>;

	constructor(options?: Partial<FormOptions<Values, ValidationSchema>>) {
		super();
		this.options = Object.assign(
			{
				rules: {},
				preserveValues: false,
				enableReinitialize: false,
				validateMessages: undefined,
				validateTrigger: "change",
			},
			options
		);

		this.initialize(false);
	}

	initialize(notify = true) {
		const oldValues = { ...this.values };
		const oldMeta = { ...this.meta };
		this.values = clone(this.options.initialValues ?? ({} as Values));
		this.name = this.options.name ?? uniqueId();

		this.meta = {
			dirty: false,
			errors: [],
			touched: false,
			submitting: false,
			valid: true,
			submissionCount: 0,
			validating: false,
			validationCount: 0,
		};

		this.cancelValidate();

		if (notify) {
			this.trigger("change", this);
			this.trigger("change:value", this.values, oldValues);
			this.trigger("change:meta", this.meta, oldMeta);
		}
	}

	updateOptions = (options: Partial<FormOptions<Values, ValidationSchema>>) => {
		if (this.options.name !== options.name) {
			const oldName = this.name;
			this.name = options.name ?? uniqueId();
			GlobalInstances.renameForm(oldName, this.name);
		}

		this.options = options;

		if (
			this.options.enableReinitialize &&
			!isEqual(this.values, options.initialValues)
		) {
			this.initialize();
			this.trigger("reInitialize");
		}
	};

	mount = () => {
		const fieldsToAdd: FieldBaseInstance<any, any, ValidationSchema>[] = [];
		this.fields.forEach((field) => {
			if (field.options.registerInstance !== false) {
				fieldsToAdd.push(field);
			}
		});

		GlobalInstances.addForm(this as any, fieldsToAdd);

		return () => {
			GlobalInstances.removeForm(this.name);
		};
	};

	// Handle meta
	setMeta = (meta: FormMeta) => {
		const oldMeta = this.meta;
		this.meta = meta;
		this.trigger("change:meta", meta, oldMeta);
		this.trigger("change", this);
	};

	setMetaKey = <K extends keyof FormMeta>(key: K, value: FormMeta[K]) => {
		const oldMeta = { ...this.meta };
		set(this.meta, key, value);
		this.trigger("change:meta", this.meta, oldMeta);
		this.trigger("change", this);
	};

	// Handle values
	setValues = (values: Values, options?: UpdateValueOptions) => {
		const oldValues = { ...this.values };
		this.values = values;
		if (options?.touched) {
			this.setMetaKey("touched", true);
		}
		if (options?.dirty) {
			this.setMetaKey("dirty", true);
		}

		(options?.dirty || options?.touched) &&
			this.options.onValuesChange?.(values, oldValues);

		this.trigger("change", this);
		this.trigger("change:value", this.values, oldValues);
		options?.validate && this.validate();
	};

	getValues = (): Values => {
		return this.values;
	};

	// Handle fields
	addField = (field: FieldBaseInstance<any, Values, ValidationSchema>) => {
		if (!this.fields.has(field)) {
			this.fields.add(field);

			field.options.registerInstance !== false &&
				GlobalInstances.addField(this.name, field);
		}

		return () => {
			this.removeField(field);
		};
	};

	removeField = (field: FieldBaseInstance<any, Values, ValidationSchema>) => {
		const fieldName = field.name;
		const registerInstance = field.options.registerInstance;

		if (!this.fields.has(field)) {
			return;
		}

		const deleted = this.fields.delete(field);
		if (!deleted) {
			return;
		}

		registerInstance !== false &&
			GlobalInstances.removeField(this.name, fieldName);

		// TODO: Make it work

		// if (!this.options.preserveValues && !field.options.preserveValue) {
		// 	const oldValues = { ...this.values };

		// 	deleteFrom(this.values, fieldName);
		// 	this.trigger("change", this);
		// 	this.trigger("change:value", this.values, oldValues);
		// }
	};

	removeFieldByUid = (uid: string) => {
		let result:
			| FieldBaseInstance<unknown, Values, ValidationSchema>
			| undefined;
		this.fields.forEach((field) => {
			if (field.uid === uid) {
				result = field;
			}
		});

		if (result) {
			GlobalInstances.removeField(this.name, result.name);
			this.fields.delete(result);
		}
	};

	getFieldByName = <N extends GetKeys<Values>>(
		name: N
	): FieldBaseInstance<GetType<Values, N>, Values, ValidationSchema> => {
		let result:
			| FieldBaseInstance<GetType<Values, N>, Values, ValidationSchema>
			| undefined;
		this.fields.forEach((field) => {
			if (field.name === name) {
				result = field;
			}
		});

		if (!result) {
			throw new Error(`[${name}] cannot be found`);
		}

		return result;
	};

	filterFields = (
		compareFn: (
			field: FieldBaseInstance<unknown, Values, ValidationSchema>
		) => boolean
	): FieldBaseInstance<unknown, Values, ValidationSchema>[] => {
		const result: FieldBaseInstance<unknown, Values, ValidationSchema>[] = [];
		this.fields.forEach((field) => {
			if (compareFn(field)) {
				result.push(field);
			}
		});

		return result;
	};

	// Handle Field value
	setFieldValue = <N extends GetKeys<Values>>(
		name: N,
		value: GetType<Values, N>,
		options?: UpdateValueOptions
	) => {
		const oldValues = this.values;
		const values = { ...this.values };
		set(values, name, value);
		this.setValues(values, options);

		this.trigger("change", this);
		this.trigger("change:value", this.values, oldValues);
	};

	getFieldValue = <N extends GetKeys<Values>>(name: N): GetType<Values, N> => {
		return get(this.values, name);
	};

	// Handle reset
	reset = () => {
		this.initialize();
		this.trigger("reset");
	};

	// handle submit
	submit = () => {
		this.setMetaKey("submissionCount", this.meta.submissionCount + 1);
		this.setMetaKey("submitting", true);

		this.validate({
			trigger: "submit",
		})
			.then(({ valid, errors }) => {
				this.setMetaKey("submitting", false);
				if (valid) {
					this.options.onSubmit?.(this.values);
					this.trigger("submit", this.values);
				} else {
					this.options.onError?.(errors);
					this.trigger("error", errors);
				}
			})
			.catch(() => {
				this.setMetaKey("submitting", false);
			});
	};

	submitAsync = async () => {
		try {
			this.setMetaKey("submissionCount", this.meta.submissionCount + 1);
			this.setMetaKey("submitting", true);

			const { valid, errors } = await this.validate({
				trigger: "submit",
			});

			if (valid) {
				this.options.onSubmit?.(this.values);
				this.trigger("submit", this.values);

				return this.values;
			} else {
				this.options.onError?.(errors);
				this.trigger("error", errors);

				throw errors;
			}
		} finally {
			this.setMetaKey("submitting", false);
		}
	};

	// Handle validate
	getValidationSchema = () => {
		return this.options.validationSchema;
	};

	validate = (options?: ValidationOptions) => {
		return this.validateFields(undefined, options);
	};

	validateFields = async <Field extends GetKeys<Values>>(
		fields?: Field | Field[],
		options?: ValidationOptions
	): Promise<ValidationResult> => {
		const validator = this.options.validator;
		if (!validator) {
			this.setMetaKey("errors", []);
			return {
				valid: true,
				errors: [],
			};
		}

		const fieldValidationPromises: PromiseLike<ValidationResult>[] = [];

		if (this.options.validationSchema) {
			const promises = getValidationSchema(
				this.options.validationSchema,
				options
			).map((schema) => {
				return validator.validate({
					schema,
					value: this.values,
				});
			});

			fieldValidationPromises.push(...promises);
		}

		if (fields) {
			const fieldList = toArray(fields);

			this.fields.forEach((field) => {
				if (fieldList.includes(field.name as any)) {
					fieldValidationPromises.push(field.validate(options));
				}
			});
		} else {
			this.fields.forEach((field) => {
				fieldValidationPromises.push(field.validate(options));
			});
		}

		return Promise.all(fieldValidationPromises).then((results) => {
			const invalidResults = results.filter(({ valid }) => !valid);

			const errors = normalizeErrors(
				fields
					? this.meta.errors
							.filter((error) => {
								const fieldList = toArray(fields);
								return !fieldList.includes(error.field as any);
							})
							.concat(invalidResults.flatMap((result) => result.errors))
					: invalidResults.flatMap((result) => result.errors)
			);

			this.setMetaKey("errors", errors);
			this.setMetaKey("valid", errors.length === 0);

			return {
				valid: errors.length === 0,
				errors,
			};
		});
	};

	// TODO: Should cancel current validating too
	cancelValidate = () => {
		if (!this.validationPromise) {
			return;
		}

		this.validationPromise.reject({ cancelled: true });
		this.validationPromise = undefined;
		this.fields.forEach((field) => {
			field.cancelValidate();
		});
	};

	clearValidate = () => {
		this.cancelValidate();
		this.setMetaKey("errors", []);
		this.fields.forEach((field) => {
			field.clearValidate();
		});
	};
}
