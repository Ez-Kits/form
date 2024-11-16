import { render, renderHook, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { Index } from "solid-js";
import { FieldErrors, useField, useFieldContext, useForm } from "src/index";
import { describe, it, vi } from "vitest";

describe("Field", () => {
	it("Field - Element Children", ({ expect }) => {
		function MainForm() {
			const mainForm = useForm({
				initialValues: {
					username: "",
				},
			});

			return (
				<mainForm.Form>
					<form>
						<mainForm.Field name="username">
							<span data-testid="text">Just a text</span>
						</mainForm.Field>
					</form>
				</mainForm.Form>
			);
		}

		render(MainForm);

		const textEl = screen.getByTestId("text");
		expect(textEl).toHaveTextContent("Just a text");
	});

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
						{({ field }) => (
							<CustomInput
								{...field.getInputProps()}
								data-testid="usernameInput"
							/>
						)}
					</field.Field>
					<field.FieldArray name="cardNumbers">
						{({ fieldsInfo, fieldArray }) => {
							return (
								<Index each={fieldsInfo()}>
									{(_, index) => {
										return (
											<fieldArray.Field index={index} onBlur={onBlur}>
												{({ field }) => {
													return (
														<input
															{...field.getInputProps()}
															value={field.getValue()}
															data-testid={`cardNumberInput[${index}]`}
														/>
													);
												}}
											</fieldArray.Field>
										);
									}}
								</Index>
							);
						}}
					</field.FieldArray>
				</>
			);
		}

		function InnerFieldData() {
			const field = useFieldContext<FormData["user"], FormData>();
			const fieldData = field.useFieldData();

			return <div data-testid="fieldData">{JSON.stringify(fieldData())}</div>;
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

		render(MainForm);

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
		usernameInput.blur();
		expect(usernameInput).toHaveValue("johnson");
		await userEvent.type(cardNumberInput, "456");
		cardNumberInput.blur();
		expect(cardNumberInput).toHaveValue("123456");

		await new Promise((resolve) => setTimeout(resolve, 1000));

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

		render(MainForm);

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

		render(MainForm);

		const usernameInput = screen.getByTestId("usernameInput");

		expect(usernameInput).toBeInTheDocument();
		expect(usernameInput).toHaveValue("johnson");

		await userEvent.clear(usernameInput);

		expect(usernameInput).toHaveValue("");
	});

	it("useField - Outside Form", ({ expect }) => {
		expect(() => {
			renderHook(() => {
				useField({ name: "username" });
			});
		}).toThrowError();
	});
});
