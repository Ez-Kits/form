import { render, renderHook, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { Index } from "solid-js";
import { useFieldArrayContext, useForm } from "src/index";
import { describe, it, vi } from "vitest";

describe("Field Array - Operators", () => {
	interface User {
		username: string;
		password: string;
	}

	interface UsersForm {
		users: User[];
	}

	const formData: UsersForm = {
		users: Array(10)
			.fill(0)
			.map((_, index) => {
				return {
					username: `user_${index + 1}`,
					password: "secret_password",
				};
			}),
	};

	it("Push", async ({ expect }) => {
		const user: User = {
			username: "user 1",
			password: "secret_password",
		};

		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo().map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												{({ field }) => (
													<input
														data-testid={`users.username.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												{({ field }) => (
													<input
														data-testid={`users.password.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
										</>
									);
								})}

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.push(user)}
								>
									Add user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(() => <ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);

		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);

		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);

		await userEvent.click(actionButton);

		expect(screen.getByTestId("users.username.10")).toBeInTheDocument();
		expect(screen.getByTestId("users.password.10")).toBeInTheDocument();
		expect(screen.getByTestId("users.username.10")).toHaveValue(user.username);
		expect(screen.getByTestId("users.password.10")).toHaveValue(user.password);
	});

	it("Pop", async ({ expect }) => {
		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo().map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												{({ field }) => (
													<input
														data-testid={`users.username.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												{({ field }) => (
													<input
														data-testid={`users.password.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
										</>
									);
								})}

								<span data-testid="users_length">{fieldsInfo().length}</span>

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.pop()}
								>
									Pop user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(() => <ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");
		const usersLength = screen.getByTestId("users_length");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);
		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();
		expect(usersLength).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);
		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);
		expect(usersLength).toHaveTextContent("10");

		await userEvent.click(actionButton);

		expect(usersLength).toHaveTextContent("9");
	});

	it("Insert", async ({ expect }) => {
		const newUser: User = {
			username: "User to insert",
			password: "Password",
		};

		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo().map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												{({ field }) => (
													<input
														data-testid={`users.username.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												{({ field }) => (
													<input
														data-testid={`users.password.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
										</>
									);
								})}

								<span data-testid="users_length">{fieldsInfo().length}</span>

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.insert(2, newUser)}
								>
									Insert user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(() => <ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");
		const usersLength = screen.getByTestId("users_length");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);
		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();
		expect(usersLength).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);
		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);
		expect(usersLength).toHaveTextContent("10");

		await userEvent.click(actionButton);

		expect(usersLength).toHaveTextContent("11");
		expect(screen.getByTestId(`users.username.2`)).toHaveValue(
			newUser.username
		);
		expect(screen.getByTestId(`users.password.2`)).toHaveValue(
			newUser.password
		);
	});

	it("Shift", async ({ expect }) => {
		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo().map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												{({ field }) => (
													<input
														data-testid={`users.username.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												{({ field }) => (
													<input
														data-testid={`users.password.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
										</>
									);
								})}

								<span data-testid="users_length">{fieldsInfo().length}</span>

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.shift()}
								>
									Shift user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(() => <ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");
		const usersLength = screen.getByTestId("users_length");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);
		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();
		expect(usersLength).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);
		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);
		expect(usersLength).toHaveTextContent("10");

		await userEvent.click(actionButton);

		expect(usersLength).toHaveTextContent("9");
	});

	it("Unshift", async ({ expect }) => {
		const user: User = {
			username: "user abc",
			password: "secret_password_abc",
		};

		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo().map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												{({ field }) => (
													<input
														data-testid={`users.username.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												{({ field }) => (
													<input
														data-testid={`users.password.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
										</>
									);
								})}

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.unshift(user)}
								>
									Unshift user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(() => <ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);

		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);

		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);

		await userEvent.click(actionButton);

		expect(screen.getByTestId("users.username.0")).toBeInTheDocument();
		expect(screen.getByTestId("users.password.0")).toBeInTheDocument();
		expect(screen.getByTestId("users.username.0")).toHaveValue(user.username);
		expect(screen.getByTestId("users.password.0")).toHaveValue(user.password);
	});

	it("Replace", async ({ expect }) => {
		const user: User = {
			username: "user abc",
			password: "secret_password_abc",
		};

		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo().map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												{({ field }) => (
													<input
														data-testid={`users.username.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												{({ field }) => (
													<input
														data-testid={`users.password.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
										</>
									);
								})}

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.replace(0, user)}
								>
									Unshift user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(() => <ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);

		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);

		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);

		await userEvent.click(actionButton);

		expect(screen.getByTestId("users.username.0")).toBeInTheDocument();
		expect(screen.getByTestId("users.password.0")).toBeInTheDocument();
		expect(screen.getByTestId("users.username.0")).toHaveValue(user.username);
		expect(screen.getByTestId("users.password.0")).toHaveValue(user.password);
	});

	it("Remove", async ({ expect }) => {
		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo().map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												{({ field }) => (
													<input
														data-testid={`users.username.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												{({ field }) => (
													<input
														data-testid={`users.password.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
										</>
									);
								})}

								<span data-testid="users_length">{fieldsInfo().length}</span>

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.remove(0)}
								>
									Pop user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(() => <ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");
		const usersLength = screen.getByTestId("users_length");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);
		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();
		expect(usersLength).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);
		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);
		expect(usersLength).toHaveTextContent("10");

		await userEvent.click(actionButton);

		expect(usersLength).toHaveTextContent("9");
	});

	it("Move", async ({ expect }) => {
		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo().map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												{({ field }) => (
													<input
														data-testid={`users.username.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												{({ field }) => (
													<input
														data-testid={`users.password.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
										</>
									);
								})}

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.move(0, 9)}
								>
									Unshift user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(() => <ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);

		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);

		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);

		await userEvent.click(actionButton);

		expect(screen.getByTestId("users.username.9")).toBeInTheDocument();
		expect(screen.getByTestId("users.password.9")).toBeInTheDocument();
		expect(screen.getByTestId("users.username.9")).toHaveValue(
			formData.users[0]?.username
		);
		expect(screen.getByTestId("users.password.9")).toHaveValue(
			formData.users[0]?.password
		);
	});

	it("Swap", async ({ expect }) => {
		function ListUsers() {
			const form = useForm({ initialValues: { ...formData } });

			return (
				<form.Form>
					<form.FieldArray name="users">
						{({ fieldArray, fieldsInfo }) => (
							<div>
								{fieldsInfo().map((_, index) => {
									return (
										<>
											<fieldArray.Field index={index} name="username">
												{({ field }) => (
													<input
														data-testid={`users.username.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
											<fieldArray.Field index={index} name="password">
												{({ field }) => (
													<input
														data-testid={`users.password.${index}`}
														{...field.getInputProps()}
													/>
												)}
											</fieldArray.Field>
										</>
									);
								})}

								<button
									data-testid="action_btn"
									onClick={() => fieldArray.swap(0, 9)}
								>
									Unshift user
								</button>
							</div>
						)}
					</form.FieldArray>
				</form.Form>
			);
		}

		render(() => <ListUsers />);

		const usernameInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.username.${index}`));
		const passwordInputs = Array(10)
			.fill(0)
			.map((_, index) => screen.getByTestId(`users.password.${index}`));
		const actionButton = screen.getByTestId("action_btn");

		usernameInputs.map((usernameInput) =>
			expect(usernameInput).toBeInTheDocument()
		);

		passwordInputs.map((passwordInput) =>
			expect(passwordInput).toBeInTheDocument()
		);
		expect(actionButton).toBeInTheDocument();

		usernameInputs.map((usernameInput, index) =>
			expect(usernameInput).toHaveValue(formData.users[index]?.username)
		);

		passwordInputs.map((passwordInput, index) =>
			expect(passwordInput).toHaveValue(formData.users[index]?.password)
		);

		await userEvent.click(actionButton);

		expect(screen.getByTestId("users.username.9")).toBeInTheDocument();
		expect(screen.getByTestId("users.password.9")).toBeInTheDocument();
		expect(screen.getByTestId("users.username.9")).toHaveValue(
			formData.users[0]?.username
		);
		expect(screen.getByTestId("users.password.9")).toHaveValue(
			formData.users[0]?.password
		);

		expect(screen.getByTestId("users.username.0")).toBeInTheDocument();
		expect(screen.getByTestId("users.password.0")).toBeInTheDocument();
		expect(screen.getByTestId("users.username.0")).toHaveValue(
			formData.users[9]?.username
		);
		expect(screen.getByTestId("users.password.0")).toHaveValue(
			formData.users[9]?.password
		);
	});
});

describe("FieldArray - Others", () => {
	it("FieldArray - Element Children", ({ expect }) => {
		function MainForm() {
			const mainForm = useForm({
				initialValues: {
					cards: "",
				},
			});

			return (
				<mainForm.Form>
					<form>
						<mainForm.FieldArray name="cards">
							<span data-testid="text">Just a text</span>
						</mainForm.FieldArray>
					</form>
				</mainForm.Form>
			);
		}

		render(MainForm);

		const textEl = screen.getByTestId("text");
		expect(textEl).toHaveTextContent("Just a text");
	});
});

describe("Field Array - Values", () => {
	it("Nested Field", async ({ expect }) => {
		const onBlur = vi.fn(() => {
			//
		});
		const formData = {
			users: [
				{
					username: "",
					cardNumbers: ["123"],
				},
			],
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
			const field = useFieldArrayContext<FormData["users"], FormData>();
			const fieldsInfo = field.useFieldsInfo();

			return (
				<Index each={fieldsInfo()}>
					{(_, index) => (
						<>
							<field.Field index={index} name="username">
								{({ field }) => (
									<CustomInput
										{...field.getInputProps({
											onChangePropName: "onChange",
										})}
										data-testid={`usernameInput[${index}]`}
									/>
								)}
							</field.Field>
							<field.FieldArray index={index} name="cardNumbers">
								{({ fieldsInfo, fieldArray }) => {
									return (
										<Index each={fieldsInfo()}>
											{(_, innerIndex) => {
												return (
													<fieldArray.Field index={index} onBlur={onBlur}>
														{({ field }) => (
															<input
																{...field.getInputProps()}
																data-testid={`cardNumberInput[${index}][${innerIndex}]`}
															/>
														)}
													</fieldArray.Field>
												);
											}}
										</Index>
									);
								}}
							</field.FieldArray>
						</>
					)}
				</Index>
			);
		}

		function InnerFieldData() {
			const field = useFieldArrayContext<FormData["users"], FormData>();
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
						<mainForm.FieldArray name="users">
							<InnerFields />
							<InnerFieldData />
						</mainForm.FieldArray>
					</form>
				</mainForm.Form>
			);
		}

		render(MainForm);

		const usernameInput = screen.getByTestId("usernameInput[0]");
		const cardNumberInput = screen.getByTestId("cardNumberInput[0][0]");
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

	it("useFieldArrayContext - Throw", ({ expect }) => {
		expect(() => {
			renderHook(() => useFieldArrayContext());
		}).toThrowError();
	});
});
