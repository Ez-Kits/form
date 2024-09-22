import { yupValidator } from "@ez-kits/form-yup-validator";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import LoginPageVue from "__tests__/forms/LoginPage.vue";
import RegisterPageVue from "__tests__/forms/RegisterPage.vue";
import { registerGlobalValidator } from "src/global";
import { describe, it } from "vitest";
import * as yup from "yup";

describe("Async Validator", () => {
	registerGlobalValidator(yupValidator);
	it("Login Form", async () => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const loginFormData: LoginForm = {
			username: "johnson",
			password: "secret_password",
		};

		render(LoginPageVue, {
			props: {
				validationSchema: yup.object({
					username: yup.string().required().length(6),
				}),
				passwordValidationSchema: yup
					.string()
					.required()
					.matches(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")),
			},
		});

		const usernameInput = screen.getByTestId("usernameInput");
		const passwordInput = screen.getByTestId("passwordInput");

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();

		await user.type(usernameInput, loginFormData.username);
		await user.type(passwordInput, loginFormData.password);

		expect(usernameInput).toHaveValue(loginFormData.username);
		expect(passwordInput).toHaveValue(loginFormData.password);

		const usernameErrors = screen.getByTestId("usernameErrors");
		const passwordErrors = screen.getByTestId("passwordErrors");

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

		render(RegisterPageVue, {
			props: {
				passwordValidationSchema: yup
					.string()
					.required()
					.matches(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")),

				confirmPasswordValidationSchema: yup
					.string()
					.oneOf(
						[yup.ref("password"), undefined],
						"Confirm password doesn't match password."
					),
			},
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

		const passwordErrors = screen.getByTestId("passwordErrors");
		const confirmPasswordErrors = screen.getByTestId("confirmPasswordErrors");

		expect(passwordErrors.innerHTML.length).toBeGreaterThanOrEqual(1);
		expect(confirmPasswordErrors.innerHTML.length).toBeGreaterThanOrEqual(1);
	});
});
