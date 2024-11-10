import { FieldInstance, FormInstance } from "@ez-kits/form-core";
import { yupValidator } from "src/index";
import { describe, it } from "vitest";
import * as yup from "yup";

describe("Yup validator", () => {
	it("Form level", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm, yup.Schema>({
			validator: yupValidator,
			validationSchema: yup.object({
				username: yup.string().required().length(6),
				password: yup
					.string()
					.required()
					.matches(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")),
			}),
		});
		const userName = new FieldInstance<string, LoginForm, yup.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, LoginForm, yup.Schema>(form, {
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

		const form = new FormInstance<RegisterForm, yup.Schema>({
			validator: yupValidator,
		});
		const userName = new FieldInstance<string, RegisterForm, yup.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, yup.Schema>(form, {
			name: "password",
			validationSchema: yup
				.string()
				.required()
				.matches(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")),
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "confirmPassword",
				validationSchema: (_, { form }) =>
					yup
						.string()
						.oneOf(
							[form.getFieldValue("password"), undefined],
							"Confirm password doesn't match password."
						),
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
			password: "CorrectPassword@1234",
			confirmPassword: "CorrectPassword@1234",
		};

		const form = new FormInstance<RegisterForm, yup.Schema>({
			validator: yupValidator,
		});
		const userName = new FieldInstance<string, RegisterForm, yup.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, yup.Schema>(form, {
			name: "password",
			validationSchema: yup
				.string()
				.required()
				.matches(/^(?=.*[A-Za-z])(?=.*\d)[\w\W]{8,}$/),
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "confirmPassword",
				validationSchema: (_, { form }) =>
					yup
						.string()
						.oneOf(
							[form.getFieldValue("password"), undefined],
							"Confirm password doesn't match password."
						),
			}
		);
		userName.mount();
		password.mount();
		confirmPassword.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);

		form.validate({ trigger: "change" }).then(({ valid, errors }) => {
			console.log(errors);

			expect(valid).toBe(true);
			expect(errors.length).toBe(0);
		});
	});
});
