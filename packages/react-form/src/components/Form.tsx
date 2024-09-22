/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FormInstance, FormOptions } from "@ez-kits/form-core";
import type { ReactElement, ReactNode } from "react";
import formContext from "src/contexts/formContext";
import type { DefaultValidationSchema } from "src/global";
import useForm from "src/hooks/useForm";

export interface FormProps<
	FormValues,
	ValidationSchema = DefaultValidationSchema
> extends FormOptions<FormValues, ValidationSchema> {
	form?: FormInstance<FormValues, ValidationSchema>;
	children?: ReactNode;
}

export default function Form<
	FormValues,
	ValidationSchema = DefaultValidationSchema
>({ children, ...props }: FormProps<FormValues, ValidationSchema>) {
	const form = useForm(props);
	form.useFormMeta();

	return (
		<formContext.Provider value={{ form: form }}>
			{children}
		</formContext.Provider>
	);
}

Form.displayName = "Form";

export type FormComponent<
	FormValues,
	ValidationSchema = DefaultValidationSchema
> = (props: FormProps<FormValues, ValidationSchema>) => ReactElement;
