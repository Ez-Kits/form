import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import LoginPage from "__tests__/forms/LoginPage.vue";
import RegisterPage from "__tests__/forms/RegisterPage.vue";
import { useForm, useInjectForm } from "src/index";
import { describe, it } from "vitest";

describe("Form values", () => {
	it("Login form", async () => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const loginFormData: LoginForm = {
			username: "johnson",
			password: "secret_password",
		};

		render(LoginPage);
		const usernameInput = screen.getByTestId("usernameInput");
		const passwordInput = screen.getByTestId("passwordInput");

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();

		await userEvent.type(usernameInput, loginFormData.username);
		await userEvent.type(passwordInput, loginFormData.password);

		expect(usernameInput).toHaveValue(loginFormData.username);
		expect(passwordInput).toHaveValue(loginFormData.password);
	});

	it("Login form with default values", async () => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const loginFormData: LoginForm = {
			username: "johnson",
			password: "secret_password",
		};

		render(LoginPage, {
			props: { initialValues: loginFormData },
		});
		const usernameInput = screen.getByTestId("usernameInput");
		const passwordInput = screen.getByTestId("passwordInput");

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(usernameInput).toHaveValue(loginFormData.username);
		expect(passwordInput).toHaveValue(loginFormData.password);

		await userEvent.type(usernameInput, "_2");
		await userEvent.type(passwordInput, "_2");

		expect(usernameInput).toHaveValue(loginFormData.username + "_2");
		expect(passwordInput).toHaveValue(loginFormData.password + "_2");
	});

	// ---------------------------------------------------------------------------

	it("Register form", async () => {
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
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
		};

		render(RegisterPage);
		const usernameInput = screen.getByTestId("usernameInput");
		const passwordInput = screen.getByTestId("passwordInput");
		const confirmPasswordInput = screen.getByTestId("confirmPasswordInput");
		const addressLineOneInput = screen.getByTestId("addressLineOneInput");
		const addressLineTwoInput = screen.getByTestId("addressLineTwoInput");

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(confirmPasswordInput).toBeInTheDocument();
		expect(addressLineOneInput).toBeInTheDocument();
		expect(addressLineTwoInput).toBeInTheDocument();

		await userEvent.type(usernameInput, formData.username);
		await userEvent.type(passwordInput, formData.password);
		await userEvent.type(confirmPasswordInput, formData.confirmPassword);
		await userEvent.type(addressLineOneInput, formData.address.lineOne);
		await userEvent.type(addressLineTwoInput, formData.address.lineTwo);

		expect(usernameInput).toHaveValue(formData.username);
		expect(passwordInput).toHaveValue(formData.password);
		expect(confirmPasswordInput).toHaveValue(formData.confirmPassword);
		expect(addressLineOneInput).toHaveValue(formData.address.lineOne);
		expect(addressLineTwoInput).toHaveValue(formData.address.lineTwo);
	});

	it("Register form with default values", async () => {
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
			confirmPassword: "secret_password",
			address: {
				lineOne: "VTP, Thanh Xuan",
				lineTwo: "HN, Viet Nam",
			},
		};

		render(RegisterPage, {
			props: { initialValues: formData },
		});
		const usernameInput = screen.getByTestId("usernameInput");
		const passwordInput = screen.getByTestId("passwordInput");
		const confirmPasswordInput = screen.getByTestId("confirmPasswordInput");
		const addressLineOneInput = screen.getByTestId("addressLineOneInput");
		const addressLineTwoInput = screen.getByTestId("addressLineTwoInput");
		const observeUsernameEl = screen.getByTestId("observeUsername");

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(confirmPasswordInput).toBeInTheDocument();
		expect(addressLineOneInput).toBeInTheDocument();
		expect(addressLineTwoInput).toBeInTheDocument();
		expect(observeUsernameEl).toBeInTheDocument();

		expect(usernameInput).toHaveValue(formData.username);
		expect(passwordInput).toHaveValue(formData.password);
		expect(confirmPasswordInput).toHaveValue(formData.confirmPassword);
		expect(addressLineOneInput).toHaveValue(formData.address.lineOne);
		expect(addressLineTwoInput).toHaveValue(formData.address.lineTwo);

		await userEvent.type(usernameInput, "_2");
		await userEvent.type(passwordInput, "_2");

		expect(usernameInput).toHaveValue(formData.username + "_2");
		expect(passwordInput).toHaveValue(formData.password + "_2");
		expect(observeUsernameEl).toHaveTextContent(formData.username + "_2");
	});

	it("useInjectForm Outside Form", ({ expect }) => {
		expect(() => {
			useInjectForm();
		}).toThrowError();
	});

	it("useFormData", ({ expect }) => {
		const form = useForm({
			initialValues: {
				username: "johnson",
				password: "secret_password",
			},
		});

		const formValues = form.useFormData();

		expect(formValues.value.values).toEqual(form.options.initialValues);

		form.setFieldValue("username", "johnson_2");

		expect(formValues.value.values).toEqual({
			username: "johnson_2",
			password: "secret_password",
		});
	});

	it("useFormValues - With Selector", ({ expect }) => {
		const form = useForm({
			initialValues: {
				username: "johnson",
				password: "secret_password",
			},
		});

		const username = form.useFormValues(({ username }) => username);

		expect(username.value).toEqual(form.options.initialValues?.username);

		form.setFieldValue("username", "johnson_2");

		expect(username.value).toEqual("johnson_2");
	});

	it("useFormMeta - With Selector", ({ expect }) => {
		const form = useForm({
			initialValues: {
				username: "johnson",
				password: "secret_password",
			},
		});

		const isFormDirty = form.useFormMeta(({ dirty }) => dirty);

		expect(isFormDirty.value).toBeFalsy();

		form.setFieldValue("username", "johnson_2", {
			dirty: true,
		});

		expect(isFormDirty.value).toBeTruthy();
	});
});
