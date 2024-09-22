import { FieldInstance, FormInstance } from "@ez-kits/form-core";
import { Rule } from "async-validator";
import { asyncValidator } from "src/index";
import { describe, it } from "vitest";

describe("Async validator", () => {
	it("Login Form", ({ expect }) => {
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

		form.validate().then(({ valid, errors }) => {
			expect(valid).toBe(false);
			expect(errors.length).toBe(2);
		});
	});

	it("Register Form", ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
			address: {
				lineOne: string;
				lineTwo: string;
			};
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "secret_password",
			confirmPassword: "secret_password_2",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
		};

		const form = new FormInstance<RegisterForm, Rule>({
			validator: asyncValidator,
		});
		const userName = new FieldInstance<string, RegisterForm, Rule>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, Rule>(form, {
			name: "password",
			validationSchema: {
				type: "string",
				pattern: new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$"),
				required: true,
			},
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, Rule>(
			form,
			{
				name: "confirmPassword",
				validationSchema: (confirmPassword, { form }) => [
					{
						validator() {
							if (form.getFieldValue("password") !== confirmPassword) {
								return ["Confirm password doesn't match password."];
							}

							return [];
						},
					},
				],
			}
		);
		const addressLineOne = new FieldInstance<string, RegisterForm, Rule>(form, {
			name: "address.lineOne",
		});
		const addressLineTwo = new FieldInstance<string, RegisterForm, Rule>(form, {
			name: "address.lineTwo",
		});

		userName.mount();
		password.mount();
		confirmPassword.mount();
		addressLineOne.mount();
		addressLineTwo.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);
		addressLineOne.handleChange(formData.address.lineOne);
		addressLineTwo.handleChange(formData.address.lineTwo);

		form.validate().then(({ valid, errors }) => {
			expect(valid).toBe(false);
			expect(errors.length).toBe(2);
		});
	});
});
