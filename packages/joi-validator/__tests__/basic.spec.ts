import { FieldInstance, FormInstance } from "@ez-kits/form-core";
import Joi from "joi";
import { joiValidator } from "src/index";
import { describe, it } from "vitest";

describe("Joi validator", () => {
	it("Form level", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm, Joi.Schema>({
			validator: joiValidator,
			validationSchema: Joi.object({
				username: Joi.string().length(6),
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

		userName.handleChange("joh3son");
		password.handleChange("123456");

		form.validate({ trigger: "change" }).then(({ valid, errors }) => {
			expect(valid).toBe(false);
			expect(errors.length).toBe(2);
		});
	});

	it("Field level", ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "secret_password",
			confirmPassword: "secret_password_2",
		};

		const form = new FormInstance<RegisterForm, Joi.Schema>({
			validator: joiValidator,
		});
		const userName = new FieldInstance<string, RegisterForm, Joi.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, Joi.Schema>(form, {
			name: "password",
			validationSchema: Joi.string().regex(
				new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")
			),
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, Joi.Schema>(
			form,
			{
				name: "confirmPassword",
				validationSchema: (_, { form }) =>
					Joi.string().equal(form.getFieldValue("password")),
			}
		);

		userName.mount();
		password.mount();
		confirmPassword.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);

		form.validate({ trigger: "change" }).then(({ valid, errors }) => {
			expect(valid).toBe(false);
			expect(errors.length).toBe(2);
		});
	});

	it("Valid validation", ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "CorrectPassword@123",
			confirmPassword: "CorrectPassword@123",
		};

		const form = new FormInstance<RegisterForm, Joi.Schema>({
			validator: joiValidator,
		});
		const userName = new FieldInstance<string, RegisterForm, Joi.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, Joi.Schema>(form, {
			name: "password",
			validationSchema: Joi.string().regex(
				/^(?=.*[A-Za-z])(?=.*\d)[\w\W]{8,}$/
			),
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, Joi.Schema>(
			form,
			{
				name: "confirmPassword",
				validationSchema: (_, { form }) =>
					Joi.string().equal(form.getFieldValue("password")),
			}
		);

		userName.mount();
		password.mount();
		confirmPassword.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);

		form.validate({ trigger: "change" }).then(({ valid, errors }) => {
			expect(valid).toBe(true);
			expect(errors.length).toBe(0);
		});
	});
});
