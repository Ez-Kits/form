/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FormInstance, FormOptions } from "@ez-kits/form-core";
import { splitProps, type JSXElement } from "solid-js";
import formContext from "src/contexts/formContext";
import type { DefaultValidationSchema } from "src/global";
import useForm from "src/hooks/useForm";

export interface FormProps<
	FormValues,
	ValidationSchema = DefaultValidationSchema
> extends FormOptions<FormValues, ValidationSchema> {
	form?: FormInstance<FormValues, ValidationSchema>;
	children?: JSXElement;
}

function Form<FormValues, ValidationSchema = DefaultValidationSchema>(
	props: FormProps<FormValues, ValidationSchema>
) {
	const [local, others] = splitProps(props, ["children"]);

	const form = useForm(others);
	form.useFormMeta();

	return (
		<formContext.Provider value={{ form: form }}>
			{local.children}
		</formContext.Provider>
	);
}

Form.displayName = "Form";

export default Form;

export type FormComponent<
	FormValues,
	ValidationSchema = DefaultValidationSchema
> = (props: FormProps<FormValues, ValidationSchema>) => JSXElement;
