import { zodValidator } from "@ez-kits/form-zod-validator";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { registerGlobalValidator } from "src/global";
import { createForm } from "src/index";
import { describe, it } from "vitest";
import { z } from "zod";

describe("Zod Validator", () => {
	registerGlobalValidator(zodValidator);
	const renderErrors = (testId: string) =>
		`<span data-testid="${testId}"></span>`;

	it("Login Form", async () => {
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
			${renderErrors("usernameErrors")}
			<input data-testid="passwordInput" type="password" name="password" />
			${renderErrors("passwordErrors")}
			<button type="submit" data-testid="submitButton">
				Submit
			</button>
		</form>`;

		const form = createForm<LoginForm, z.Schema>({
			el: "#loginForm",
			validationSchema: z.object({
				username: z.string().length(6),
				password: z
					.string()
					.refine((value) =>
						new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$").test(value)
					),
			}),
		});

		const usernameField = form.createField({
			name: "username",
		});
		const passwordField = form.createField({
			name: "password",
		});

		const usernameErrors = screen.getByTestId("usernameErrors");
		const passwordErrors = screen.getByTestId("passwordErrors");

		usernameField.on("change:meta", ({ errors }) => {
			if (errors) {
				usernameErrors.innerHTML = errors
					.flatMap(({ messages }) => messages)
					.join("\n");
			}
		});

		passwordField.on("change:meta", ({ errors }) => {
			if (errors) {
				passwordErrors.innerHTML = errors
					.flatMap(({ messages }) => messages)
					.join("\n");
			}
		});

		const usernameInput = screen.getByTestId("usernameInput");
		const passwordInput = screen.getByTestId("passwordInput");
		const submitButton = screen.getByTestId("submitButton");

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();

		await user.type(usernameInput, loginFormData.username);
		await user.type(passwordInput, loginFormData.password);
		await user.click(submitButton);

		expect(usernameInput).toHaveValue(loginFormData.username);
		expect(passwordInput).toHaveValue(loginFormData.password);

		expect(usernameErrors.innerHTML.length).toBeGreaterThanOrEqual(1);
		expect(passwordErrors.innerHTML.length).toBeGreaterThanOrEqual(1);
	});

	it("Register Form", async ({ expect }) => {
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

		document.body.innerHTML = `
		<form id="registerForm">
		<input data-testid="usernameInput" name="username" />
		<input data-testid="passwordInput" type="password" name="password" />
		${renderErrors("passwordErrors")}
		<input data-testid="confirmPasswordInput" type="password" name="confirmPassword" />
		${renderErrors("confirmPasswordErrors")}
		<input data-testid="addressLineOneInput" type="address" name="address.lineOne" />
		<input data-testid="addressLineTwoInput" type="address" name="address.lineTwo" />
			
		</form>
		`;

		const form = createForm<RegisterForm, z.Schema>({
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
		const passwordField = form.createField({
			name: "password",
			validationSchema: z
				.string()
				.refine((value) =>
					new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$").test(value)
				),
		});
		const confirmPasswordField = form.createField({
			name: "confirmPassword",
			validationSchema: (confirmPassword, { form }) =>
				z
					.string()
					.refine(
						() => confirmPassword === form.getFieldValue("password"),
						"Confirm password doesn't match password."
					),
		});

		const passwordErrors = screen.getByTestId("passwordErrors");
		const confirmPasswordErrors = screen.getByTestId("confirmPasswordErrors");

		passwordField.on("change:meta", ({ errors }) => {
			if (errors) {
				passwordErrors.innerHTML = errors
					.flatMap(({ messages }) => messages)
					.join("\n");
			}
		});

		confirmPasswordField.on("change:meta", ({ errors }) => {
			if (errors) {
				confirmPasswordErrors.innerHTML = errors
					.flatMap(({ messages }) => messages)
					.join("\n");
			}
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

		await user.type(usernameInput, formData.username);
		await user.type(passwordInput, formData.password);
		await user.type(confirmPasswordInput, formData.confirmPassword);
		await user.type(addressLineOneInput, formData.address.lineOne);
		await user.type(addressLineTwoInput, formData.address.lineTwo);

		expect(usernameInput).toHaveValue(formData.username);
		expect(passwordInput).toHaveValue(formData.password);
		expect(confirmPasswordInput).toHaveValue(formData.confirmPassword);
		expect(addressLineOneInput).toHaveValue(formData.address.lineOne);
		expect(addressLineTwoInput).toHaveValue(formData.address.lineTwo);

		expect(passwordErrors.innerHTML.length).toBeGreaterThanOrEqual(1);
		expect(confirmPasswordErrors.innerHTML.length).toBeGreaterThanOrEqual(1);
	});
});
