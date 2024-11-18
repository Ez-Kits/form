import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	BindingFieldInput,
	FieldErrors,
	useField,
	useFieldContext,
	useForm,
} from "src/index";
import { describe, it } from "vitest";

describe("Field", () => {
	it("Nested Field", async ({ expect }) => {
		const onBlur = vi.fn(() => {
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

		function InnerFields() {
			const field = useFieldContext<FormData["user"], FormData>();

			return (
				<>
					<field.Field name="username">
						<BindingFieldInput>
							<CustomInput data-testid="usernameInput" />
						</BindingFieldInput>
					</field.Field>
					<field.FieldArray name="cardNumbers">
						{({ fieldsInfo, fieldArray }) => {
							return (
								<>
									{fieldsInfo.map((_, index) => {
										return (
											<fieldArray.Field
												key={index}
												name={`[${index}]`}
												onBlur={onBlur}
											>
												<BindingFieldInput>
													<input data-testid={`cardNumberInput[${index}]`} />
												</BindingFieldInput>
											</fieldArray.Field>
										);
									})}
								</>
							);
						}}
					</field.FieldArray>
				</>
			);
		}

		function InnerFieldData() {
			const field = useFieldContext<FormData["user"], FormData>();
			const fieldData = field.useFieldData();

			return <div data-testid="fieldData">{JSON.stringify(fieldData)}</div>;
		}

		function MainForm() {
			const mainForm = useForm({
				initialValues: formData,
			});

			return (
				<mainForm.Form>
					<form>
						<mainForm.Field name="user">
							<InnerFields />
							<InnerFieldData />
						</mainForm.Field>
					</form>
				</mainForm.Form>
			);
		}

		render(<MainForm></MainForm>);

		const usernameInput = screen.getByTestId("usernameInput");
		const cardNumberInput = screen.getByTestId("cardNumberInput[0]");
		const fieldData = screen.getByTestId("fieldData");

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
		expect(onBlur).toBeCalled();
	});

	it("useFieldContext - Throw", ({ expect }) => {
		expect(() => {
			renderHook(() => useFieldContext());
		}).toThrowError();
	});

	it("Field - Functional Children", async ({ expect }) => {
		function MainForm() {
			const mainForm = useForm({
				initialValues: {
					username: "johnson",
				},
			});

			return (
				<mainForm.Form>
					<mainForm.Field name="username">
						{({ field }) => {
							return (
								<input
									data-testid="usernameInput"
									value={field.getValue()}
									onChange={field.handleChange}
								/>
							);
						}}
					</mainForm.Field>
				</mainForm.Form>
			);
		}

		render(<MainForm></MainForm>);

		const usernameInput = screen.getByTestId("usernameInput");

		expect(usernameInput).toBeInTheDocument();
		expect(usernameInput).toHaveValue("johnson");

		await userEvent.clear(usernameInput);

		expect(usernameInput).toHaveValue("");
	});

	it("FieldErrors - Empty Children", async ({ expect }) => {
		function MainForm() {
			const mainForm = useForm({
				initialValues: {
					username: "johnson",
				},
			});

			return (
				<mainForm.Form>
					<mainForm.Field name="username">
						{({ field }) => {
							return (
								<>
									<input
										data-testid="usernameInput"
										value={field.getValue()}
										onChange={field.handleChange}
									/>
									<FieldErrors></FieldErrors>
								</>
							);
						}}
					</mainForm.Field>
				</mainForm.Form>
			);
		}

		render(<MainForm></MainForm>);

		const usernameInput = screen.getByTestId("usernameInput");

		expect(usernameInput).toBeInTheDocument();
		expect(usernameInput).toHaveValue("johnson");

		await userEvent.clear(usernameInput);

		expect(usernameInput).toHaveValue("");
	});

	it("BindingFieldInput - Other Index", async ({ expect }) => {
		function MainForm() {
			const mainForm = useForm({
				initialValues: {
					username: "johnson",
				},
			});

			return (
				<mainForm.Form>
					<mainForm.Field name="username">
						<BindingFieldInput inputIndex={1}>
							<FieldErrors>
								{(errors) => {
									return (
										<span>{errors?.flatMap((error) => error.messages)}</span>
									);
								}}
							</FieldErrors>
							<input data-testid="usernameInput" />
						</BindingFieldInput>
					</mainForm.Field>
				</mainForm.Form>
			);
		}

		render(<MainForm></MainForm>);

		const usernameInput = screen.getByTestId("usernameInput");

		expect(usernameInput).toBeInTheDocument();
		expect(usernameInput).toHaveValue("johnson");

		await userEvent.clear(usernameInput);

		expect(usernameInput).toHaveValue("");
	});

	it("BindingFieldInput - Functional Children", async ({ expect }) => {
		function MainForm() {
			const mainForm = useForm({
				initialValues: {
					username: "johnson",
				},
			});

			return (
				<mainForm.Form>
					<mainForm.Field name="username">
						<BindingFieldInput>
							{() => <input data-testid="usernameInput" />}
						</BindingFieldInput>
					</mainForm.Field>
				</mainForm.Form>
			);
		}

		render(<MainForm></MainForm>);

		const usernameInput = screen.getByTestId("usernameInput");

		expect(usernameInput).toBeInTheDocument();
		expect(usernameInput).toHaveValue("johnson");

		await userEvent.clear(usernameInput);

		expect(usernameInput).toHaveValue("");
	});

	it("BindingFieldInput - Invalid element", ({ expect }) => {
		function MainForm() {
			const mainForm = useForm({
				initialValues: {
					username: "johnson",
				},
			});

			return (
				<mainForm.Form>
					<mainForm.Field name="username">
						<BindingFieldInput>Invalid element</BindingFieldInput>
					</mainForm.Field>
				</mainForm.Form>
			);
		}

		render(<MainForm></MainForm>);

		expect(() => {
			screen.getByTestId("usernameInput");
		}).toThrowError();
	});

	it("useField - Outside Form", ({ expect }) => {
		expect(() => {
			renderHook(() => {
				useField({ name: "username" as never });
			});
		}).toThrowError();
	});
});
