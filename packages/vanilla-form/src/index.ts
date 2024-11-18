/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
	FieldArrayInstance,
	FieldBaseInstance,
	FieldInstance,
	FormInstance,
	type FieldOptions,
	type FormOptions,
	type GetKeys,
	type GetType,
} from "@ez-kits/form-core";
import type { DefaultValidationSchema } from "src/global";
import { mergeFormOptions } from "src/utilities/form";
export type * from "@ez-kits/form-core";

export {
	getFieldArrayInstance,
	getFieldInstance,
	getFormInstance,
	GlobalInstances,
} from "@ez-kits/form-core";

export { registerGlobalValidator } from "src/global";
export type {
	DefaultValidationSchema,
	GlobalRegister,
	GlobalValidator,
} from "src/global";

export type FieldNameProps<ParentValue, N = GetKeys<ParentValue>> = {
	name: N;
	namePrefix?: string;
};

declare module "@ez-kits/form-core" {
	interface FormOptions<Values, ValidationSchema> {
		el: string | HTMLFormElement;
	}

	interface FormInstance<Values, ValidationSchema> {
		el: HTMLFormElement;
		unmount: () => void;

		createField: CreateField<Values, Values, ValidationSchema>;
		createFieldArray: CreateFieldArray<Values, Values, ValidationSchema>;
	}

	interface FieldBaseInstance<FieldValue, FormValues, ValidationSchema> {
		unmount: () => void;
		createField: CreateField<FormValues, FieldValue, ValidationSchema>;
		createFieldArray: CreateFieldArray<
			FormValues,
			FieldValue,
			ValidationSchema
		>;
	}
}

export function createForm<Values, ValidationSchema = DefaultValidationSchema>(
	options: FormOptions<Values, ValidationSchema>
): FormInstance<Values, ValidationSchema> {
	const form = new FormInstance(mergeFormOptions(options));
	form.unmount = form.mount();

	form.createField = (options) => createField(form, options) as any;
	form.createFieldArray = (options) => createFieldArray(form, options) as any;

	const formEl: HTMLFormElement | null =
		typeof options.el === "string"
			? document.querySelector(options.el)
			: options.el;

	if (!formEl) {
		throw new Error(`Form [${options.el.toString()}] cannot be found`);
	}

	form.el = formEl;

	formEl.addEventListener("submit", (e) => {
		if (e.defaultPrevented) {
			return;
		}

		e.preventDefault();
		form.submit();
	});

	return form;
}

// ---------------------------
// Field
// ---------------------------

type CreateFieldOptions<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> &
	Omit<FieldOptions<FieldValue, FormValues, ValidationSchema>, "name"> & {
		inputEl?:
			| string
			| HTMLInputElement
			| HTMLTextAreaElement
			| HTMLSelectElement;
		valuePropName?: string;
		blurEventName?: string;
		changeEventName?: string;
		valuePropInEvent?: string;
		autoBinding?: boolean;
		handleInput?: (
			field: FieldInstance<
				GetType<ParentValue, N>,
				FormValues,
				ValidationSchema
			>
		) => void;
	};

export type CreateField<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema
> = <N extends GetKeys<ParentValue> = GetKeys<ParentValue>>(
	options: CreateFieldOptions<FormValues, ParentValue, ValidationSchema, N>
) => FieldInstance<GetType<ParentValue, N>, FormValues, ValidationSchema>;

/**
 * Create a field instance.
 *
 * @param form - The form instance.
 * @param options - The field options.
 * @returns A field instance.
 */
function createField<
	FormValues = unknown,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
>(
	form: FormInstance<FormValues, ValidationSchema>,
	options: CreateFieldOptions<FormValues, ParentValue, ValidationSchema, N>
) {
	const fieldName = [options.namePrefix, options.name]
		.filter((d) => d !== undefined)
		.join(".");

	const field = new FieldInstance(form, {
		...options,
		name: fieldName as any,
	});
	field.unmount = field.mount();

	field.createField = (props) =>
		createField(form, {
			...props,
			namePrefix: field.name,
		} as any);

	field.createFieldArray = (props) =>
		createFieldArray(form, {
			...props,
			namePrefix: field.name,
		} as any) as any;

	if (options.handleInput) {
		options.handleInput(field);
	} else if (options.autoBinding !== false) {
		const formContainerEl = form.el ? form.el : document;

		const getInputEl = (): HTMLElement | null => {
			if (typeof options.inputEl === "string") {
				return formContainerEl.querySelector(options.inputEl);
			}

			return (
				options.inputEl ??
				formContainerEl.querySelector(`[name="${fieldName}"]`)
			);
		};

		const inputEl = getInputEl();

		if (!inputEl) {
			throw new Error(
				`Field [${(options.inputEl ?? fieldName).toString()}] cannot be found`
			);
		}

		const {
			valuePropName = "value",
			blurEventName = "blur",
			changeEventName = "change",
		} = options;

		const getInputValue = () => {
			const raw = field.getValue();
			if (
				["input", "textarea", "select"].includes(inputEl.tagName.toLowerCase())
			) {
				return raw ?? "";
			}

			return raw;
		};

		(inputEl as any)[valuePropName] = getInputValue() as never;

		inputEl.addEventListener(blurEventName, (e) => {
			field.handleBlur(e);
		});

		inputEl.addEventListener(changeEventName, (e) => {
			field.handleChange(e);
		});

		field.on("change:value", () => {
			(inputEl as any)[valuePropName] = getInputValue() as never;
		});
	}

	return field;
}

// ---------------------------
// Field Array
// ---------------------------

type CreateFieldArrayOptions<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
> = FieldNameProps<ParentValue, N> &
	Omit<FieldOptions<FieldValue, FormValues, ValidationSchema>, "name"> & {
		/**
		 * Container element. Should only contain the items.
		 */
		el: string | HTMLElement;
		itemTemplate: (
			index: number,
			fieldArray: FieldArrayInstance<FieldValue, FormValues, ValidationSchema>
		) => HTMLElement;
		itemFieldsCreator: (
			index: number,
			fieldArray: FieldArrayInstance<FieldValue, FormValues, ValidationSchema>
		) => FieldBaseInstance<any, any, ValidationSchema>[];
	};

export type CreateFieldArray<
	FormValues,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema
> = <
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>,
	FieldValue = GetType<ParentValue, N>
>(
	options: CreateFieldArrayOptions<FormValues, ParentValue, ValidationSchema, N>
) => FieldArrayInstance<FieldValue, FormValues, ValidationSchema>;

function createFieldArray<
	FormValues = unknown,
	ParentValue = FormValues,
	ValidationSchema = DefaultValidationSchema,
	N extends GetKeys<ParentValue> = GetKeys<ParentValue>
>(
	form: FormInstance<FormValues, ValidationSchema>,
	options: CreateFieldArrayOptions<FormValues, ParentValue, ValidationSchema, N>
): FieldArrayInstance<GetType<ParentValue, N>, FormValues, ValidationSchema> {
	const fieldName = [options.namePrefix, options.name]
		.filter((d) => d !== undefined)
		.join(".");

	const field = new FieldArrayInstance(form, {
		...options,
		name: fieldName as any,
	});
	field.unmount = field.mount();

	field.createField = (props) =>
		createField(form, {
			...props,
			namePrefix: field.name,
		} as any) as any;

	field.createFieldArray = (props) =>
		createFieldArray(form, {
			...props,
			namePrefix: field.name,
		} as any) as any;

	const initialValue = field.value;

	// Initial templates
	const containerEl =
		typeof options.el === "string"
			? form.el.querySelector(options.el)
			: options.el;

	if (!containerEl) {
		throw new Error(`Field [${options.el.toString()}] cannot be found`);
	}

	containerEl.append(
		...(Array.isArray(initialValue)
			? initialValue.map((_, index) => {
					return options.itemTemplate(index, field);
			  })
			: [])
	);

	// Initial fields
	const itemsFields: FieldBaseInstance<any, any, any>[][] = Array.isArray(
		initialValue
	)
		? initialValue.map((_, index) => {
				return options.itemFieldsCreator(index, field);
		  })
		: [];

	field.on("change:value", () => {
		const items = Array.isArray(field.value) ? field.value : [];
		const itemsEl = containerEl.children;

		if (itemsFields.length > items.length) {
			for (let index = items.length; index < itemsFields.length; index++) {
				const el = itemsEl.item(index);
				el?.remove();

				const fields = itemsFields[index];
				fields?.forEach((f) => f.unmount());
			}
			itemsFields.splice(items.length);
		} else if (itemsFields.length < items.length) {
			const tempArr = Array(items.length - itemsFields.length).fill(0);
			containerEl.append(
				...tempArr.map((_, index) => {
					return options.itemTemplate(itemsFields.length + index, field);
				})
			);
			itemsFields.push(
				...tempArr.map((_, index) => {
					return options.itemFieldsCreator(itemsFields.length + index, field);
				})
			);
		}
	});

	return field;
}
