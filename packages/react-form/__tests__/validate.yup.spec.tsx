import { yupValidator } from "@ez-kits/form-yup-validator";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import {
	BindingFieldInput,
	FieldErrors,
	registerGlobalValidator,
	useForm,
	type ValidateError,
} from "src/index";
import { describe, it } from "vitest";
import * as yup from "yup";

describe("Yup Validator", () => {
	registerGlobalValidator(yupValidator);
	const renderErrors =
		(testId: string) =>
		(errors: ValidateError[] = []) =>
			(
				<span data-testid={testId}>
					{errors.flatMap(({ messages }) => messages)}
				</span>
			);

	it("Login Form", async () => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const loginFormData: LoginForm = {
			username: "johnson",
			password: "secret_password",
		};

		function LoginPage() {
			const form = useForm<LoginForm, yup.Schema>({
				validationSchema: yup.object({
					username: yup.string().required().length(6),
					password: yup
						.string()
						.required()
						.matches(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")),
				}),
				// onError(errors) {
				// 	const field = form.getFieldByName("password");
				// 	console.log(form.meta.errors, errors, field.meta.errors);
				// },
			});

			return (
				<form.Form>
					<form {...form.getFormProps()}>
						<form.Field name="username">
							<BindingFieldInput>
								<input data-testid="usernameInput" />
							</BindingFieldInput>
							<FieldErrors>{renderErrors("usernameErrors")}</FieldErrors>
						</form.Field>
						<form.Field name="password">
							<BindingFieldInput>
								<input data-testid="passwordInput" type="password" />
							</BindingFieldInput>
							<FieldErrors>{renderErrors("passwordErrors")}</FieldErrors>
						</form.Field>
						<button type="submit" data-testid="submitButton">
							Submit
						</button>
					</form>
				</form.Form>
			);
		}

		render(<LoginPage />);

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

		function RegisterPage() {
			const form = useForm<RegisterForm, yup.Schema>({});

			return (
				<form.Form>
					<form {...form.getFormProps()}>
						<form.Field name="username">
							<BindingFieldInput>
								<input data-testid="usernameInput" />
							</BindingFieldInput>
						</form.Field>
						<form.Field
							name="password"
							validationSchema={yup
								.string()
								.required()
								.matches(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$"))}
						>
							<BindingFieldInput>
								<input data-testid="passwordInput" type="password" />
							</BindingFieldInput>
							<FieldErrors>{renderErrors("passwordErrors")}</FieldErrors>
						</form.Field>
						<form.Field
							name="confirmPassword"
							validationSchema={(_, { form }) =>
								yup
									.string()
									.oneOf(
										[form.getFieldValue("password"), undefined],
										"Confirm password doesn't match password."
									)
							}
						>
							<BindingFieldInput>
								<input data-testid="confirmPasswordInput" type="password" />
							</BindingFieldInput>
							<FieldErrors>{renderErrors("confirmPasswordErrors")}</FieldErrors>
						</form.Field>
						<form.Field name="address.lineOne">
							<BindingFieldInput>
								<input data-testid="addressLineOneInput" type="address" />
							</BindingFieldInput>
						</form.Field>
						<form.Field name="address.lineTwo">
							<BindingFieldInput>
								<input data-testid="addressLineTwoInput" type="address" />
							</BindingFieldInput>
						</form.Field>
					</form>
				</form.Form>
			);
		}

		render(<RegisterPage />);
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
