import FieldInstance from "src/Field";
import FieldArrayInstance from "src/FieldArray";
import FormInstance from "src/Form";
import { describe, it, vi } from "vitest";
import * as yup from "yup";
import { yupValidator } from "./yup-validator";

describe("Form", () => {
	it("Basic Login Form", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm, unknown>();
		const userName = new FieldInstance<string, LoginForm, unknown>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, LoginForm, unknown>(form, {
			name: "password",
		});

		userName.mount();
		password.mount();

		userName.handleChange("johnson");
		password.handleChange("secret_password");

		expect(form.getValues()).toMatchObject({
			username: "johnson",
			password: "secret_password",
		});
	});

	it("Register Form - Nested values", ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
			address: {
				lineOne: string;
				lineTwo: string;
			};
			cardNumbers: string[];
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "secret_password",
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
			cardNumbers: ["123"],
		};

		const form = new FormInstance<RegisterForm, unknown>();
		const userName = new FieldInstance<string, RegisterForm, unknown>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, unknown>(form, {
			name: "password",
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, unknown>(
			form,
			{
				name: "confirmPassword",
			}
		);
		const addressLineOne = new FieldInstance<string, RegisterForm, unknown>(
			form,
			{
				name: "address.lineOne",
			}
		);
		const addressLineTwo = new FieldInstance<string, RegisterForm, unknown>(
			form,
			{
				name: "address.lineTwo",
			}
		);
		const cardNumbers = new FieldArrayInstance<string[], RegisterForm, unknown>(
			form,
			{
				name: "cardNumbers",
			}
		);

		userName.mount();
		password.mount();
		confirmPassword.mount();
		addressLineOne.mount();
		addressLineTwo.mount();
		cardNumbers.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);
		addressLineOne.handleChange(formData.address.lineOne);
		addressLineTwo.handleChange(formData.address.lineTwo);
		cardNumbers.push(formData.cardNumbers[0]!);

		expect(form.getValues()).toMatchObject(formData);
	});

	it("Reset", ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
			address: {
				lineOne: string;
				lineTwo: string;
			};
			cardNumbers: string[];
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "secret_password",
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
			cardNumbers: ["123"],
		};

		const form = new FormInstance<RegisterForm, unknown>();
		const unmount = form.mount();
		const userName = new FieldInstance<string, RegisterForm, unknown>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, unknown>(form, {
			name: "password",
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, unknown>(
			form,
			{
				name: "confirmPassword",
			}
		);
		const addressLineOne = new FieldInstance<string, RegisterForm, unknown>(
			form,
			{
				name: "address.lineOne",
			}
		);
		const addressLineTwo = new FieldInstance<string, RegisterForm, unknown>(
			form,
			{
				name: "address.lineTwo",
			}
		);
		const cardNumbers = new FieldArrayInstance<string[], RegisterForm, unknown>(
			form,
			{
				name: "cardNumbers",
			}
		);

		userName.mount();
		password.mount();
		confirmPassword.mount();
		addressLineOne.mount();
		addressLineTwo.mount();
		cardNumbers.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);
		addressLineOne.handleChange(formData.address.lineOne);
		addressLineTwo.handleChange(formData.address.lineTwo);
		cardNumbers.push(formData.cardNumbers[0]!);

		expect(form.getValues()).toMatchObject(formData);

		form.reset();

		expect(userName.getValue()).toBe(undefined);
		expect(password.getValue()).toBe(undefined);
		expect(confirmPassword.getValue()).toBe(undefined);
		expect(addressLineOne.getValue()).toBe(undefined);
		expect(addressLineTwo.getValue()).toBe(undefined);
		expect(cardNumbers.getValue()).toBe(undefined);
		unmount();
	});

	it("Submit", async ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
			address: {
				lineOne: string;
				lineTwo: string;
			};
			cardNumbers: string[];
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "secret_password",
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
			cardNumbers: ["123"],
		};
		const onSubmit = vi.fn(() => {});
		const form = new FormInstance<RegisterForm, unknown>({
			onSubmit,
		});
		const unmount = form.mount();
		const userName = new FieldInstance<string, RegisterForm, unknown>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, unknown>(form, {
			name: "password",
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, unknown>(
			form,
			{
				name: "confirmPassword",
			}
		);
		const addressLineOne = new FieldInstance<string, RegisterForm, unknown>(
			form,
			{
				name: "address.lineOne",
			}
		);
		const addressLineTwo = new FieldInstance<string, RegisterForm, unknown>(
			form,
			{
				name: "address.lineTwo",
			}
		);
		const cardNumbers = new FieldArrayInstance<string[], RegisterForm, unknown>(
			form,
			{
				name: "cardNumbers",
			}
		);

		userName.mount();
		password.mount();
		confirmPassword.mount();
		addressLineOne.mount();
		addressLineTwo.mount();
		cardNumbers.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);
		addressLineOne.handleChange(formData.address.lineOne);
		addressLineTwo.handleChange(formData.address.lineTwo);
		cardNumbers.push(formData.cardNumbers[0]!);

		form.submit();
		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(onSubmit).toBeCalled();
		expect(form.getValues()).toMatchObject(formData);

		unmount();
	});

	it("Async submit", async ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
			address: {
				lineOne: string;
				lineTwo: string;
			};
			cardNumbers: string[];
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "secret_password",
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
			cardNumbers: ["123"],
		};

		const form = new FormInstance<RegisterForm, unknown>();
		const unmount = form.mount();
		const userName = new FieldInstance<string, RegisterForm, unknown>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, unknown>(form, {
			name: "password",
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, unknown>(
			form,
			{
				name: "confirmPassword",
			}
		);
		const addressLineOne = new FieldInstance<string, RegisterForm, unknown>(
			form,
			{
				name: "address.lineOne",
			}
		);
		const addressLineTwo = new FieldInstance<string, RegisterForm, unknown>(
			form,
			{
				name: "address.lineTwo",
			}
		);
		const cardNumbers = new FieldArrayInstance<string[], RegisterForm, unknown>(
			form,
			{
				name: "cardNumbers",
			}
		);

		userName.mount();
		password.mount();
		confirmPassword.mount();
		addressLineOne.mount();
		addressLineTwo.mount();
		cardNumbers.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);
		addressLineOne.handleChange(formData.address.lineOne);
		addressLineTwo.handleChange(formData.address.lineTwo);
		cardNumbers.push(formData.cardNumbers[0]!);

		const values = await form.submitAsync();

		expect(values).toMatchObject(formData);

		unmount();
	});

	it("Async submit - Invalid", async ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
			address: {
				lineOne: string;
				lineTwo: string;
			};
			cardNumbers: string[];
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "secret_password",
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
			cardNumbers: ["123"],
		};

		const form = new FormInstance<RegisterForm, yup.Schema>({
			validator: yupValidator,
			validationSchema: yup.object({
				username: yup.string().required().min(8),
			}),
		});
		const unmount = form.mount();
		const userName = new FieldInstance<string, RegisterForm, yup.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, yup.Schema>(form, {
			name: "password",
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "confirmPassword",
			}
		);
		const addressLineOne = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "address.lineOne",
			}
		);
		const addressLineTwo = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "address.lineTwo",
			}
		);
		const cardNumbers = new FieldArrayInstance<
			string[],
			RegisterForm,
			yup.Schema
		>(form, {
			name: "cardNumbers",
		});

		userName.mount();
		password.mount();
		confirmPassword.mount();
		addressLineOne.mount();
		addressLineTwo.mount();
		cardNumbers.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);
		addressLineOne.handleChange(formData.address.lineOne);
		addressLineTwo.handleChange(formData.address.lineTwo);
		cardNumbers.push(formData.cardNumbers[0]!);

		await expect(async () => {
			await form.submitAsync();
		}).rejects.toThrow(Array);

		unmount();
	});

	it("On Error", async ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
			address: {
				lineOne: string;
				lineTwo: string;
			};
			cardNumbers: string[];
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "secret_password",
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
			cardNumbers: ["123"],
		};

		const onError = vi.fn(() => {});
		const form = new FormInstance<RegisterForm, yup.Schema>({
			validator: yupValidator,
			validationSchema: yup.object({
				username: yup.string().min(8),
			}),
			onError,
		});
		const unmount = form.mount();
		const userName = new FieldInstance<string, RegisterForm, yup.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, yup.Schema>(form, {
			name: "password",
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "confirmPassword",
			}
		);
		const addressLineOne = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "address.lineOne",
			}
		);
		const addressLineTwo = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "address.lineTwo",
			}
		);
		const cardNumbers = new FieldArrayInstance<
			string[],
			RegisterForm,
			yup.Schema
		>(form, {
			name: "cardNumbers",
		});

		userName.mount();
		password.mount();
		confirmPassword.mount();
		addressLineOne.mount();
		addressLineTwo.mount();
		cardNumbers.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);
		addressLineOne.handleChange(formData.address.lineOne);
		addressLineTwo.handleChange(formData.address.lineTwo);
		cardNumbers.push(formData.cardNumbers[0]!);

		form.submit();
		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(onError).toBeCalled();
		form.clearValidate();
		expect(form.meta.errors).toEqual([]);
		unmount();
	});

	it("Cancel Validate", async ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
			address: {
				lineOne: string;
				lineTwo: string;
			};
			cardNumbers: string[];
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "secret_password",
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
			cardNumbers: ["123"],
		};

		const onError = vi.fn(() => {});
		const form = new FormInstance<RegisterForm, yup.Schema>({
			validator: yupValidator,
			validationSchema: yup.object({
				username: yup.string().min(8),
			}),
			onError,
		});
		const unmount = form.mount();
		const userName = new FieldInstance<string, RegisterForm, yup.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, yup.Schema>(form, {
			name: "password",
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "confirmPassword",
			}
		);
		const addressLineOne = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "address.lineOne",
			}
		);
		const addressLineTwo = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "address.lineTwo",
			}
		);
		const cardNumbers = new FieldArrayInstance<
			string[],
			RegisterForm,
			yup.Schema
		>(form, {
			name: "cardNumbers",
		});

		userName.mount();
		password.mount();
		confirmPassword.mount();
		addressLineOne.mount();
		addressLineTwo.mount();
		cardNumbers.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);
		addressLineOne.handleChange(formData.address.lineOne);
		addressLineTwo.handleChange(formData.address.lineTwo);
		cardNumbers.push(formData.cardNumbers[0]!);

		form.validate({
			trigger: "change",
		});
		form.cancelValidate();

		expect(onError).not.toBeCalled();
		unmount();
	});

	it("Get Field Instance By Name", async ({ expect }) => {
		interface RegisterForm {
			username: string;
			password: string;
			confirmPassword: string;
			address: {
				lineOne: string;
				lineTwo: string;
			};
			cardNumbers: string[];
		}
		const formData: RegisterForm = {
			username: "johnson",
			password: "secret_password",
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
			cardNumbers: ["123"],
		};

		const onError = vi.fn(() => {});
		const form = new FormInstance<RegisterForm, yup.Schema>({
			validator: yupValidator,
			validationSchema: yup.object({
				username: yup.string().min(8),
			}),
			onError,
		});
		const unmount = form.mount();
		const userName = new FieldInstance<string, RegisterForm, yup.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, RegisterForm, yup.Schema>(form, {
			name: "password",
		});
		const confirmPassword = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "confirmPassword",
			}
		);
		const addressLineOne = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "address.lineOne",
			}
		);
		const addressLineTwo = new FieldInstance<string, RegisterForm, yup.Schema>(
			form,
			{
				name: "address.lineTwo",
			}
		);
		const cardNumbers = new FieldArrayInstance<
			string[],
			RegisterForm,
			yup.Schema
		>(form, {
			name: "cardNumbers",
		});

		userName.mount();
		password.mount();
		confirmPassword.mount();
		addressLineOne.mount();
		addressLineTwo.mount();
		cardNumbers.mount();

		userName.handleChange(formData.username);
		password.handleChange(formData.password);
		confirmPassword.handleChange(formData.confirmPassword);
		addressLineOne.handleChange(formData.address.lineOne);
		addressLineTwo.handleChange(formData.address.lineTwo);
		cardNumbers.push(formData.cardNumbers[0]!);

		new FieldInstance(form, {
			name: "cardNumbers.0",
		}).mount();

		const firstCardNumberField = form.getFieldByName("cardNumbers.0");

		expect(firstCardNumberField).instanceOf(FieldInstance);
		expect(firstCardNumberField.getValue()).toBe(formData.cardNumbers[0]);

		unmount();
	});
});
