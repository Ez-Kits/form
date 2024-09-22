import { FieldInstance, FormInstance } from "@ez-kits/form-core";
import { zodValidator } from "src/index";
import { describe, it } from "vitest";
import { z } from "zod";

describe("Zod validator", () => {
	it("Login Form", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm, z.Schema>({
			validator: zodValidator,
			validationSchema: z.object({
				username: z.string().length(6),
				password: z
					.string()
					.refine((value) =>
						new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$").test(value)
					),
			}),
		});
		const userName = new FieldInstance<string, LoginForm, z.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, LoginForm, z.Schema>(form, {
			name: "password",
		});
		userName.mount();
		password.mount();

		userName.handleChange("joh3son");
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

		const form = new FormInstance<RegisterForm, z.Schema>({
			validator: zodValidator,
		});
		const userName = new FieldInstance<string, RegisterForm, z.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, z.Schema>(form, {
			name: "password",
			validationSchema: z
				.string()
				.refine((value) =>
					new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$").test(value)
				),
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, z.Schema>(
			form,
			{
				name: "confirmPassword",
				validationSchema: (confirmPassword, { form }) =>
					z
						.string()
						.refine(
							() => confirmPassword === form.getFieldValue("password"),
							"Confirm password doesn't match password."
						),
			}
		);
		const addressLineOne = new FieldInstance<string, RegisterForm, z.Schema>(
			form,
			{
				name: "address.lineOne",
			}
		);
		const addressLineTwo = new FieldInstance<string, RegisterForm, z.Schema>(
			form,
			{
				name: "address.lineTwo",
			}
		);

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
