import { FieldInstance, FormInstance } from "@ez-kits/form-core";
import Joi from "joi";
import { joiValidator } from "src/index";
import { describe, it } from "vitest";

describe("Async validator", () => {
	it("Empty error message", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm, Joi.Schema>({
			validator: joiValidator,
			validationSchema: Joi.object({
				username: Joi.string().length(6).message(""),
				password: Joi.string().regex(
					new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")
				),
			}),
		});
		const userName = new FieldInstance<string, LoginForm, Joi.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, LoginForm, Joi.Schema>(form, {
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

		const form = new FormInstance<AddressForm, Joi.Schema>({
			validator: joiValidator,
		});
		const userName = new FieldInstance<string, AddressForm, Joi.Schema>(form, {
			name: "username",
		});
		const address = new FieldInstance<string, AddressForm, Joi.Schema>(form, {
			name: "address",
			validationSchema: Joi.object({
				line1: Joi.string().required(),
				line2: Joi.string().required(),
			}),
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
