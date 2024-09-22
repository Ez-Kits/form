import { FieldInstance, FormInstance } from "@ez-kits/form-core";
import { valibotValidator } from "src/index";
import * as v from "valibot";
import { describe, it } from "vitest";

describe("Valibot validator", () => {
	it("Login Form", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm, v.GenericSchema>({
			validator: valibotValidator,
			validationSchema: v.object({
				username: v.pipe(v.string(), v.length(6)),
				password: v.pipe(
					v.string(),
					v.regex(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$"))
				),
			}),
		});
		const userName = new FieldInstance<string, LoginForm, v.GenericSchema>(
			form,
			{
				name: "username",
			}
		);
		const password = new FieldInstance<string, LoginForm, v.GenericSchema>(
			form,
			{
				name: "password",
			}
		);
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

		const form = new FormInstance<RegisterForm, v.GenericSchema>({
			validator: valibotValidator,
		});
		const userName = new FieldInstance<string, RegisterForm, v.GenericSchema>(
			form,
			{
				name: "username",
			}
		);
		const password = new FieldInstance<string, RegisterForm, v.GenericSchema>(
			form,
			{
				name: "password",
				validationSchema: v.pipe(
					v.string(),
					v.regex(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$"))
				),
			}
		);
		const confirmPassword = new FieldInstance<
			string,
			RegisterForm,
			v.GenericSchema
		>(form, {
			name: "confirmPassword",
			validationSchema: (_, { form }) =>
				v.pipe(
					v.string(),
					v.check(
						(confirmPassword) =>
							confirmPassword === form.getFieldValue("password"),
						"Confirm password doesn't match password."
					)
				),
		});
		const addressLineOne = new FieldInstance<
			string,
			RegisterForm,
			v.GenericSchema
		>(form, {
			name: "address.lineOne",
		});
		const addressLineTwo = new FieldInstance<
			string,
			RegisterForm,
			v.GenericSchema
		>(form, {
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
