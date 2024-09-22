/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FormInstance,
	type FormMeta,
	type FormOptions,
	type GetKeys,
	type GetType,
} from "@ez-kits/form-core";
import {
	createEffect,
	on,
	onCleanup,
	type Accessor,
	type JSX,
	type JSXElement,
} from "solid-js";
import Field, { type FieldComponent } from "src/components/Field";
import type { FieldArrayComponent } from "src/components/FieldArray";
import FieldArray from "src/components/FieldArray";
import Form, { type FormComponent } from "src/components/Form";
import {
	Observe,
	ObserveField,
	type ObserveFieldProps,
	type ObserveProps,
} from "src/components/Observe";
import type { DefaultValidationSchema } from "src/global";
import type { UseField } from "src/hooks/useField";
import useField from "src/hooks/useField";
import type { UseFieldArray } from "src/hooks/useFieldArray";
import useFieldArray from "src/hooks/useFieldArray";
import {
	useFormData,
	useFormMeta,
	useFormValues,
	type UseFormDataValues,
} from "src/hooks/useValue";
import { handleEventPrevent, mergeFormOptions } from "src/utilities";

declare module "@ez-kits/form-core" {
	interface FormInstance<Values, ValidationSchema> {
		Field: FieldComponent<Values, Values, ValidationSchema>;
		FieldArray: FieldArrayComponent<Values, Values, ValidationSchema>;
		Form: FormComponent<Values, ValidationSchema>;
		useField: UseField<Values, Values, ValidationSchema>;
		useFieldArray: UseFieldArray<Values, Values, ValidationSchema>;
		Observe: <T = Values>(
			props: ObserveProps<Values, ValidationSchema, T>
		) => JSXElement;
		ObserveField: <N extends string = GetKeys<Values>, T = GetType<Values, N>>(
			props: ObserveFieldProps<Values, ValidationSchema, N, T>
		) => JSXElement;
		getFormProps: () => {
			onReset: JSX.CustomEventHandlersCamelCase<HTMLFormElement>["onReset"];
			onSubmit: JSX.CustomEventHandlersCamelCase<HTMLFormElement>["onSubmit"];
			disabled: boolean;
		};
		useFormValues: <T = Values>(
			selector?: (values: Values) => T
		) => Accessor<T>;
		useFormMeta: <T = FormMeta>(
			selector?: (meta: FormMeta) => T
		) => Accessor<T>;
		useFormData: <T = UseFormDataValues<Values>>(
			selector?: (values: UseFormDataValues<Values>) => T
		) => Accessor<T>;
	}
}

export interface UseFormProps<
	FormValues,
	ValidationSchema = DefaultValidationSchema
> extends FormOptions<FormValues, ValidationSchema> {
	form?: FormInstance<FormValues, ValidationSchema>;
}

export default function useForm<
	FormValues,
	ValidationSchema = DefaultValidationSchema
>(options: UseFormProps<FormValues, ValidationSchema> = {}) {
	function getForm() {
		const { form: optionsForm, ...otherOptions } = options;
		if (optionsForm) {
			optionsForm.updateOptions(
				mergeFormOptions({
					...optionsForm.options,
					...otherOptions,
				})
			);

			return optionsForm;
		}

		const formInstance = new FormInstance(options);

		formInstance.Field = Field as any;
		formInstance.FieldArray = FieldArray as any;
		formInstance.useField = useField;
		formInstance.useFieldArray = useFieldArray as any;
		formInstance.Observe = Observe;
		formInstance.ObserveField = ObserveField as any;
		formInstance.Form = (props) => <Form form={formInstance} {...props} />;

		formInstance.getFormProps = () => {
			return {
				disabled: formInstance.meta.submitting,
				onReset: handleEventPrevent(() => {
					formInstance.reset();
				}),
				onSubmit: handleEventPrevent(() => {
					formInstance.submit();
				}),
			};
		};

		formInstance.useFormMeta = function useFormMetaImpl(selector) {
			return useFormMeta(formInstance, selector);
		};
		formInstance.useFormValues = function useFormValuesImpl(selector) {
			return useFormValues(formInstance, selector);
		};
		formInstance.useFormData = function useFormDataImpl(selector) {
			return useFormData(formInstance, selector);
		};

		return formInstance;
	}

	const form = getForm();
	const unmount = form.mount();

	onCleanup(() => {
		unmount();
	});

	createEffect(
		on(
			() => options,
			() => {
				const { form: optionsForm, ...otherOptions } = options;

				form.updateOptions(
					mergeFormOptions({
						...optionsForm?.options,
						...otherOptions,
					})
				);
			}
		)
	);

	return form;
}
