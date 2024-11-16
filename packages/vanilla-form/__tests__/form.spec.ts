import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createForm } from "src/index";
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

		document.body.innerHTML = `
			<form id="loginForm">
				<input data-testid="usernameInput" name="username" />
				<input data-testid="passwordInput" name="password" type="password" />
			</form>
		`;

		const form = createForm<LoginForm>({
			el: "#loginForm",
		});

		form.createField({
			name: "password",
		});
		form.createField({
			name: "username",
		});

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

		document.body.innerHTML = `
			<form id="loginForm">
				<input data-testid="usernameInput" name="username" />
				<input data-testid="passwordInput" name="password" type="password" />
			</form>
		`;

		const form = createForm<LoginForm>({
			el: "#loginForm",
			initialValues: loginFormData,
		});

		form.createField({
			name: "password",
		});
		form.createField({
			name: "username",
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

		document.body.innerHTML = `
			<form id="registerForm">
				<input data-testid="usernameInput" name="username" />
				<input data-testid="passwordInput" type="password" name="password" />
				<input data-testid="confirmPasswordInput" type="password" name="confirmPassword" />
				<input data-testid="addressLineOneInput" name="address.lineOne" />
				<input data-testid="addressLineTwoInput" name="address.lineTwo" />
			</form>
		`;

		const form = createForm<RegisterForm>({
			el: "#registerForm",
		});

		form.createField({
			name: "address.lineOne",
		});
		form.createField({
			name: "address.lineTwo",
		});
		form.createField({
			name: "username",
		});
		form.createField({
			name: "password",
		});
		form.createField({
			name: "confirmPassword",
		});

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

		document.body.innerHTML = `
			<form id="registerForm">
				<input data-testid="usernameInput" name="username" />
				<input data-testid="passwordInput" type="password" name="password" />
				<input data-testid="confirmPasswordInput" type="password" name="confirmPassword" />
				<input data-testid="addressLineOneInput" name="address.lineOne" />
				<input data-testid="addressLineTwoInput" name="address.lineTwo" />
				<span data-testid="observeUsername" id="observeUsername">{value}</span>
			</form>
		`;

		const form = createForm<RegisterForm>({
			el: "#registerForm",
			initialValues: formData,
		});

		form.createField({
			name: "address.lineOne",
		});
		form.createField({
			name: "address.lineTwo",
		});
		form.createField({
			name: "username",
		});
		form.createField({
			name: "password",
		});
		form.createField({
			name: "confirmPassword",
		});

		form.on("change:value", (values) => {
			const el = document.getElementById("observeUsername");
			if (el) {
				el.innerHTML = values.username;
			}
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
});
