import { FieldInstance, FormInstance } from "@ez-kits/form-core";
import { Rule } from "async-validator";
import { asyncValidator } from "src/index";
import { describe, it } from "vitest";

describe("Async validator", () => {
	it("Empty error message", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm, Rule>({
			validator: asyncValidator,
			validationSchema: {
				type: "object",
				fields: {
					username: {
						required: true,
						type: "string",
						len: 6,
						message: "",
					},
					password: {
						type: "string",
						pattern: new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$"),
						required: true,
					},
				},
			},
		});
		const userName = new FieldInstance<string, LoginForm, Rule>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, LoginForm, Rule>(form, {
			name: "password",
		});
		userName.mount();
		password.mount();

		userName.handleChange("johnson");
		password.handleChange("123456");

		form.validate({ trigger: "change" }).then(({ valid, errors }) => {
			expect(valid).toBe(false);
			expect(errors.length).toBe(2);
		});
	});

	it("Field level - Nested field value", ({ expect }) => {
		interface AddressForm {
			username: string;
			address: {
				line1: string;
				line2: string;
			};
		}
		const formData: AddressForm = {
			username: "johnson",
			address: {
				line1: "",
				line2: "",
			},
		};

		const form = new FormInstance<AddressForm, Rule>({
			validator: asyncValidator,
		});
		const userName = new FieldInstance<string, AddressForm, Rule>(form, {
			name: "username",
		});
		const address = new FieldInstance<string, AddressForm, Rule>(form, {
			name: "address",
			validationSchema: {
				type: "object",
				required: true,
				fields: {
					line1: {
						required: true,
						type: "string",
					},
					line2: {
						required: true,
						type: "string",
					},
				},
			},
		});

		userName.mount();
		address.mount();

		userName.handleChange(formData.username);
		address.handleChange(formData.address);

		form.validate({ trigger: "change" }).then(({ valid, errors }) => {
			expect(valid).toBe(false);
			expect(errors.length).toBe(2);
		});
	});
});
