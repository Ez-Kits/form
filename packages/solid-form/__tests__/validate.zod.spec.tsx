import { zodValidator } from "@ez-kits/form-zod-validator";
import { render, screen } from "@solidjs/testing-library";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import type { Accessor } from "solid-js";
import {
	FieldErrors,
	registerGlobalValidator,
	useForm,
	type ValidateError,
} from "src/index";
import { describe, it } from "vitest";
import { z } from "zod";

describe("Zod Validator", () => {
	registerGlobalValidator(zodValidator);
	const renderErrors =
		(testId: string) => (errors: Accessor<ValidateError[]>) =>
			(
				<span data-testid={testId}>
					{errors().flatMap(({ messages }) => messages)}
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
			const form = useForm<LoginForm, z.Schema>({
				initialValues: {
					username: "",
					password: "",
				},
				validationSchema: z.object({
					username: z.string().length(6),
				}),
			});

			return (
				<form.Form>
					<form {...form.getFormProps()}>
						<form.Field name="username">
							{({ field, value }) => (
								<>
									<input
										data-testid="usernameInput"
										value={value()}
										{...field.getInputHandlers()}
									/>
									<FieldErrors>{renderErrors("usernameErrors")}</FieldErrors>
								</>
							)}
						</form.Field>
						<form.Field
							name="password"
							validationSchema={z
								.string()
								.refine((value) =>
									new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$").test(value)
								)}
						>
							{({ field, value }) => (
								<>
									<input
										data-testid="passwordInput"
										type="password"
										value={value()}
										{...field.getInputHandlers()}
									/>
									<FieldErrors>{renderErrors("passwordErrors")}</FieldErrors>
								</>
							)}
						</form.Field>
					</form>
				</form.Form>
			);
		}

		render(() => <LoginPage />);

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

		function RegisterPage() {
			const form = useForm<RegisterForm, z.Schema>({
				initialValues: {
					username: "",
					password: "",
					confirmPassword: "",
					address: {
						lineOne: "",
						lineTwo: "",
					},
				},
			});

			return (
				<form.Form>
					<form {...form.getFormProps()}>
						<form.Field name="username">
							{({ field, value }) => (
								<input
									data-testid="usernameInput"
									type="password"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Field
							name="password"
							validationSchema={z
								.string()
								.refine((value) =>
									new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$").test(value)
								)}
						>
							{({ field, value }) => (
								<>
									<input
										data-testid="passwordInput"
										type="password"
										value={value()}
										{...field.getInputHandlers()}
									/>
									<FieldErrors>{renderErrors("passwordErrors")}</FieldErrors>
								</>
							)}
						</form.Field>
						<form.Field
							name="confirmPassword"
							validationSchema={(confirmPassword, { form }) =>
								z
									.string()
									.refine(
										() => confirmPassword === form.getFieldValue("password"),
										"Confirm password doesn't match password."
									)
							}
						>
							{({ field, value }) => (
								<>
									<input
										data-testid="confirmPasswordInput"
										type="password"
										value={value()}
										{...field.getInputHandlers()}
									/>
									<FieldErrors>
										{renderErrors("confirmPasswordErrors")}
									</FieldErrors>
								</>
							)}
						</form.Field>
						<form.Field name="address.lineOne">
							{({ field, value }) => (
								<input
									data-testid="addressLineOneInput"
									type="password"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Field name="address.lineTwo">
							{({ field, value }) => (
								<input
									data-testid="addressLineTwoInput"
									type="password"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
					</form>
				</form.Form>
			);
		}

		render(() => <RegisterPage />);
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
