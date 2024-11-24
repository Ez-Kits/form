import { render, renderHook, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { Index } from "solid-js";
import { useForm, useFormContext } from "src/index";
import { describe, it, vi } from "vitest";

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

		function LoginPage() {
			const form = useForm<LoginForm>({
				initialValues: {
					username: "",
					password: "",
				},
			});

			return (
				<form.Form>
					<form {...form.getFormProps()}>
						<form.Field name="username">
							{({ field, value }) => (
								<input
									data-testid="usernameInput"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Field name="password">
							{({ field, value }) => (
								<input
									data-testid="passwordInput"
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

		render(() => <LoginPage />);

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

		function LoginPage() {
			const form = useForm<LoginForm>({
				initialValues: loginFormData,
			});

			return (
				<form.Form>
					<form {...form.getFormProps()}>
						<form.Field name="username">
							{({ field, value }) => (
								<input
									data-testid="usernameInput"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Field name="password">
							{({ field, value }) => (
								<input
									data-testid="passwordInput"
									type="password"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Observe>
							{({ values }) => (
								<span data-testid="formData">{JSON.stringify(values())}</span>
							)}
						</form.Observe>
					</form>
				</form.Form>
			);
		}

		render(() => <LoginPage />);
		const usernameInput = screen.getByTestId("usernameInput");
		const passwordInput = screen.getByTestId("passwordInput");
		const formData = screen.getByTestId("formData");

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(formData).toBeInTheDocument();
		expect(usernameInput).toHaveValue(loginFormData.username);
		expect(passwordInput).toHaveValue(loginFormData.password);
		expect(formData).toHaveTextContent(JSON.stringify(loginFormData));

		await userEvent.type(usernameInput, "_2");
		await userEvent.type(passwordInput, "_2");

		expect(usernameInput).toHaveValue(loginFormData.username + "_2");
		expect(passwordInput).toHaveValue(loginFormData.password + "_2");
		expect(formData).toHaveTextContent(
			JSON.stringify({
				username: loginFormData.username + "_2",
				password: loginFormData.password + "_2",
			})
		);
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

		function RegisterPage() {
			const form = useForm<RegisterForm>({
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
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Field name="password">
							{({ field, value }) => (
								<input
									data-testid="passwordInput"
									type="password"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Field name="confirmPassword">
							{({ field, value }) => (
								<input
									data-testid="confirmPasswordInput"
									type="password"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Field name="address.lineOne">
							{({ field, value }) => (
								<input
									data-testid="addressLineOneInput"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Field name="address.lineTwo">
							{({ field, value }) => (
								<input
									data-testid="addressLineTwoInput"
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

		function RegisterPage() {
			const form = useForm<RegisterForm>({
				initialValues: formData,
			});

			return (
				<form.Form>
					<form {...form.getFormProps()}>
						<form.Field name="username">
							{({ field, value }) => (
								<input
									data-testid="usernameInput"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Field name="password">
							{({ field, value }) => (
								<input
									data-testid="passwordInput"
									type="password"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Field name="confirmPassword">
							{({ field, value }) => (
								<input
									data-testid="confirmPasswordInput"
									type="password"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Field name="address.lineOne">
							{({ field, value }) => (
								<input
									data-testid="addressLineOneInput"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.Field name="address.lineTwo">
							{({ field, value }) => (
								<input
									data-testid="addressLineTwoInput"
									value={value()}
									{...field.getInputHandlers()}
								/>
							)}
						</form.Field>
						<form.ObserveField name="username">
							{({ value }) => (
								<span data-testid="observeUsername">{value()}</span>
							)}
						</form.ObserveField>
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

	it("Nested Field", async ({ expect }) => {
		const onFormReset = vi.fn(() => {
			//
		});
		const formData = {
			user: {
				username: "",
				cardNumbers: ["123"],
			},
		};
		type FormData = typeof formData;

		function CustomInput({
			value,
			onChange,
			...props
		}: {
			value?: string;
			onChange?: (value: string) => void;
		}) {
			return (
				<input
					value={value ?? ""}
					onChange={(e) => onChange?.(e.target.value)}
					{...props}
				/>
			);
		}

		function CardNumbers() {
			const form = useFormContext<FormData>();
			const fieldArray = form.useFieldArray({
				name: "user.cardNumbers",
			});
			const fieldsInfo = fieldArray.useFieldsInfo();

			return (
				<Index each={fieldsInfo()}>
					{(_, index) => {
						return (
							<fieldArray.Field name={`${index}`}>
								{({ field, value }) => (
									<input
										value={value()}
										{...field.getInputHandlers()}
										data-testid={`cardNumberInput[${index}]`}
									/>
								)}
							</fieldArray.Field>
						);
					}}
				</Index>
			);
		}

		function InnerFields() {
			const form = useFormContext<FormData>();
			const field = form.useField({
				name: "user",
			});

			return (
				<>
					<field.Field name="username">
						{({ field, value }) => (
							<CustomInput
								value={value()}
								onChange={field.handleChange}
								data-testid="usernameInput"
							/>
						)}
					</field.Field>
					<CardNumbers />
				</>
			);
		}

		function InnerFieldData() {
			const form = useFormContext<FormData>();
			const field = form.useField({
				name: "user",
			});
			const fieldData = field.useFieldData();

			return <div data-testid="fieldData">{JSON.stringify(fieldData())}</div>;
		}

		function MainForm() {
			const mainForm = useForm({
				initialValues: formData,
				onReset() {
					onFormReset();
				},
			});

			return (
				<mainForm.Form>
					<form {...mainForm.getFormProps()}>
						<InnerFields />
						<InnerFieldData />
						<button type="reset" data-testid="resetButton">
							Reset
						</button>
					</form>
				</mainForm.Form>
			);
		}

		render(MainForm);

		const usernameInput = screen.getByTestId("usernameInput");
		const cardNumberInput = screen.getByTestId("cardNumberInput[0]");
		const fieldData = screen.getByTestId("fieldData");
		const resetButton = screen.getByTestId("resetButton");

		expect(usernameInput).toBeInTheDocument();
		expect(cardNumberInput).toBeInTheDocument();
		expect(fieldData).toBeInTheDocument();
		expect(cardNumberInput).toHaveValue("123");
		expect(usernameInput).toHaveValue("");
		expect(fieldData.innerHTML).toMatch('"username":""');

		await userEvent.type(usernameInput, "johnson");
		await userEvent.type(cardNumberInput, "456");
		cardNumberInput.blur();

		expect(usernameInput).toHaveValue("johnson");
		expect(fieldData.innerHTML).toMatch(
			'"username":"johnson","cardNumbers":["123456"]'
		);

		await userEvent.click(resetButton);

		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(onFormReset).toBeCalled();
		expect(fieldData.innerHTML).toMatch('"username":""');
	});

	it("useFormContext - Throw", ({ expect }) => {
		expect(() => {
			renderHook(() => useFormContext());
		}).toThrowError();
	});

	it("useFormData", async ({ expect }) => {
		function MainFormData() {
			const form = useFormContext();
			const formData = form.useFormData();

			return <div data-testid="mainFormData">{JSON.stringify(formData())}</div>;
		}

		function MainForm() {
			const mainForm = useForm({
				initialValues: {
					username: "johnson",
				},
			});

			return (
				<mainForm.Form>
					<mainForm.Field name="username">
						{({ field, value }) => (
							<input
								value={value()}
								{...field.getInputHandlers()}
								data-testid="usernameInput"
							/>
						)}
					</mainForm.Field>
					<MainFormData />
				</mainForm.Form>
			);
		}

		render(MainForm);

		const formData = screen.getByTestId("mainFormData");
		const usernameInput = screen.getByTestId("usernameInput");

		expect(usernameInput).toHaveValue("johnson");
		expect(formData).toHaveTextContent("johnson");

		await userEvent.type(usernameInput, "_1234");

		expect(formData).toHaveTextContent("johnson_1234");
	});

	it("Observe", async ({ expect }) => {
		function MainForm() {
			const mainForm = useForm({
				initialValues: {
					username: "johnson",
				},
			});

			return (
				<mainForm.Form>
					<mainForm.Field name="username">
						{({ field, value }) => (
							<input
								value={value()}
								{...field.getInputHandlers()}
								data-testid="usernameInput"
							/>
						)}
					</mainForm.Field>
					<mainForm.Observe>
						{({ values }) => {
							return <div data-testid="username">{values().username}</div>;
						}}
					</mainForm.Observe>
				</mainForm.Form>
			);
		}

		render(MainForm);

		const username = screen.getByTestId("username");
		const usernameInput = screen.getByTestId("usernameInput");

		expect(usernameInput).toHaveValue("johnson");
		expect(username).toHaveTextContent("johnson");

		await userEvent.type(usernameInput, "_1234");

		expect(username).toHaveTextContent("johnson_1234");
	});

	it("Observe - No Children", ({ expect }) => {
		function MainForm() {
			const mainForm = useForm({
				initialValues: {
					username: "johnson",
				},
			});

			return (
				<mainForm.Form>
					<div data-testid="observe">
						<mainForm.Observe></mainForm.Observe>
					</div>
				</mainForm.Form>
			);
		}

		render(MainForm);
		const observe = screen.getByTestId("observe");
		expect(observe).toBeInTheDocument();
		expect(observe.innerHTML).toBe("");
	});

	it("ObserveField - No Children", ({ expect }) => {
		function MainForm() {
			const mainForm = useForm({
				initialValues: {
					username: "johnson",
				},
			});

			return (
				<mainForm.Form>
					<div data-testid="observe">
						<mainForm.ObserveField name="username"></mainForm.ObserveField>
					</div>
				</mainForm.Form>
			);
		}

		render(MainForm);
		const observe = screen.getByTestId("observe");
		expect(observe).toBeInTheDocument();
		expect(observe.innerHTML).toBe("");
	});
});
