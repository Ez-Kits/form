import FieldBaseInstance from "src/FieldBase";
import { FieldMeta, ValidateError } from "src/models";

export type FieldEvents<Value, ValidationSchema> = {
	change: [field: FieldInstance<any, any, ValidationSchema>];
	"change:value": [value: Value, oldValue: Value];
	"change:meta": [meta: FieldMeta];
	error: [errors: ValidateError[]];
	reset: [];
};

export default class FieldInstance<
	FieldValue,
	FormValues,
	ValidationSchema
> extends FieldBaseInstance<
	FieldValue,
	FormValues,
	ValidationSchema,
	FieldEvents<FieldValue, ValidationSchema>
> {
	protected managerName = "Field";

	// Handle field's input events
	handleChange = (event: any) => {
		let value = event;

		if (
			typeof event === "object" &&
			"target" in event &&
			event.target instanceof HTMLElement
		) {
			const target = event.target as HTMLInputElement;

			value = ["checkbox", "radio"].includes(target.type)
				? target.checked
				: target.value;
		}

		this.setValue(value, { dirty: true, touched: true });
		this.options.onChange?.(value);
		this.form.validateFields(this.name, { trigger: ["change"] });
	};

	handleBlur = (event: Event) => {
		this.setMetaKey("touched", true);
		this.form.setMetaKey("touched", true);
		this.options.onBlur?.(event);
		this.form.validateFields(this.name, { trigger: ["blur"] });
	};
}
