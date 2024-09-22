/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FormInstance,
	type FormMeta,
	type FormOptions,
} from "@ez-kits/form-core";
import Field, { type FieldComponent } from "src/components/Field";
import type { FieldArrayComponent } from "src/components/FieldArray";
import EzFieldArray from "src/components/FieldArray";
import EzForm, { type FormComponent } from "src/components/Form";
import Observe, { type ObserveComponent } from "src/components/Observe";
import type { ObserveFieldComponent } from "src/components/ObserveField";
import ObserveField from "src/components/ObserveField";
import type { UseField } from "src/composables/useField";
import useField from "src/composables/useField";
import type { UseFieldArray } from "src/composables/useFieldArray";
import useFieldArray from "src/composables/useFieldArray";
import {
	useFormData,
	useFormMeta,
	useFormValues,
	type UseFormDataValues,
} from "src/composables/useValue";
import type { DefaultValidationSchema } from "src/global";
import { provideForm } from "src/provides/form";
import { handleEventPrevent } from "src/utilities/event";
import { mergeFormOptions } from "src/utilities/form";
import { clearUndefinedProperties } from "src/utilities/object";
import {
	h,
	onBeforeUnmount,
	toValue,
	watch,
	type MaybeRef,
	type Ref,
	type Slots,
} from "vue";

declare module "@ez-kits/form-core" {
	interface FormInstance<Values, ValidationSchema> {
		Field: FieldComponent<Values, Values, ValidationSchema>;
		FieldArray: FieldArrayComponent<Values, Values, ValidationSchema>;
		Form: FormComponent<Values, ValidationSchema>;
		useField: UseField<Values, Values, ValidationSchema>;
		useFieldArray: UseFieldArray<Values, Values, ValidationSchema>;
		Observe: ObserveComponent<Values, ValidationSchema>;
		ObserveField: ObserveFieldComponent<Values, ValidationSchema>;
		getFormProps: () => {
			onReset: (e: Event) => void;
			onSubmit: (e: Event) => void;
			disabled: boolean;
		};
		useFormValues: <T = Values>(selector?: (values: Values) => T) => Ref<T>;
		useFormMeta: <T = FormMeta>(selector?: (meta: FormMeta) => T) => Ref<T>;
		useFormData: <T = UseFormDataValues<Values>>(
			selector?: (values: UseFormDataValues<Values>) => T
		) => Ref<T>;
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
>(options: MaybeRef<UseFormProps<FormValues, ValidationSchema>> = {}) {
	function getForm() {
		const { form: optionsForm, ...otherOptions } = toValue(options);
		if (optionsForm) {
			optionsForm.updateOptions(
				mergeFormOptions({
					...optionsForm.options,
					...clearUndefinedProperties(otherOptions),
				})
			);

			return optionsForm;
		}

		const form = new FormInstance(toValue(options));

		form.useField = useField as any;
		form.useFieldArray = useFieldArray as any;
		form.Field = Field as unknown as FieldComponent<
			FormValues,
			FormValues,
			ValidationSchema
		>;
		form.FieldArray = EzFieldArray as unknown as FieldArrayComponent<
			FormValues,
			FormValues,
			ValidationSchema
		>;
		form.Observe = Observe as ObserveComponent<FormValues, ValidationSchema>;
		form.ObserveField = ObserveField as any;
		form.Form = ((props: any, { slots }: { slots: Slots }) =>
			h(
				EzForm,
				{
					form: form,
					...props,
				},
				slots
			)) as unknown as FormComponent<FormValues, ValidationSchema>;

		form.getFormProps = () => {
			return {
				disabled: form.meta.submitting,
				onReset: handleEventPrevent(() => {
					form.reset();
				}),
				onSubmit: handleEventPrevent(() => {
					form.submit();
				}),
			};
		};

		form.useFormMeta = function useFormMetaImpl(selector) {
			return useFormMeta(form, selector);
		};
		form.useFormValues = function useFormValuesImpl(selector) {
			return useFormValues(form, selector);
		};
		form.useFormData = function useFormDataImpl(selector) {
			return useFormData(form, selector);
		};

		return form;
	}

	const form = getForm();

	watch(
		() => toValue(options),
		(newOptions) => {
			const { form: optionsForm, ...otherOptions } = newOptions;

			form.updateOptions(
				mergeFormOptions({
					...optionsForm?.options,
					...clearUndefinedProperties(otherOptions),
				})
			);
		}
	);

	const unmount = form.mount();
	onBeforeUnmount(unmount);

	provideForm(form);

	return form;
}
