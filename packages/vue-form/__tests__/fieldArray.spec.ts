import type { FieldArrayInstance } from "@ez-kits/form-core";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import UsersFormVue from "__tests__/forms/UsersForm.vue";
import { EzBindingFieldInput, useForm, useInjectFieldArray } from "src/index";
import { describe, it } from "vitest";
import { h } from "vue";

describe("Field Array", () => {
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

		render(UsersFormVue, {
			props: {
				initialValues: formData,
				onActionClick: (
					fieldArray: FieldArrayInstance<User[], UsersForm, unknown>
				) => {
					fieldArray.push(user);
				},
			},
		});

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
		render(UsersFormVue, {
			props: {
				initialValues: formData,
				onActionClick: (
					fieldArray: FieldArrayInstance<User[], UsersForm, unknown>
				) => {
					fieldArray.pop();
				},
			},
		});

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

		render(UsersFormVue, {
			props: {
				initialValues: formData,
				onActionClick: (
					fieldArray: FieldArrayInstance<User[], UsersForm, unknown>
				) => {
					fieldArray.insert(2, newUser);
				},
			},
		});

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
		render(UsersFormVue, {
			props: {
				initialValues: formData,
				onActionClick: (
					fieldArray: FieldArrayInstance<User[], UsersForm, unknown>
				) => {
					fieldArray.shift();
				},
			},
		});

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

		render(UsersFormVue, {
			props: {
				initialValues: formData,
				onActionClick: (
					fieldArray: FieldArrayInstance<User[], UsersForm, unknown>
				) => {
					fieldArray.unshift(user);
				},
			},
		});

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

		render(UsersFormVue, {
			props: {
				initialValues: formData,
				onActionClick: (
					fieldArray: FieldArrayInstance<User[], UsersForm, unknown>
				) => {
					fieldArray.replace(0, user);
				},
			},
		});

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
		render(UsersFormVue, {
			props: {
				initialValues: formData,
				onActionClick: (
					fieldArray: FieldArrayInstance<User[], UsersForm, unknown>
				) => {
					fieldArray.remove(0);
				},
			},
		});

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
		render(UsersFormVue, {
			props: {
				initialValues: formData,
				onActionClick: (
					fieldArray: FieldArrayInstance<User[], UsersForm, unknown>
				) => {
					fieldArray.move(0, 9);
				},
			},
		});

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
		render(UsersFormVue, {
			props: {
				initialValues: formData,
				onActionClick: (
					fieldArray: FieldArrayInstance<User[], UsersForm, unknown>
				) => {
					fieldArray.swap(0, 9);
				},
			},
		});

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

	it("Nested Field", async ({ expect }) => {
		const formData = {
			users: [
				{
					username: "",
					cardNumbers: ["123"],
				},
			],
		};
		type FormData = typeof formData;

		const UsersFieldMeta = {
			setup(props: { index: number }) {
				const field = useInjectFieldArray<FormData["users"], FormData>();
				const data = field.useFieldMeta();
				return () => {
					return [
						h(
							"div",
							{
								"data-testid": `usersMeta[${props.index}]`,
							},
							{
								default: () => JSON.stringify(data.value),
							}
						),
					];
				};
			},
		};

		const InnerFieldData = {
			props: {
				index: {
					type: Number,
					required: true,
				},
			},
			setup(props: { index: number }) {
				const field = useInjectFieldArray<FormData["users"], FormData>();
				const usernameField = field.useField({
					name: "username",
					index: props.index,
				});
				const usernameData = usernameField.useFieldData();

				const cardNumbersField = field.useFieldArray({
					name: "cardNumbers",
					index: props.index,
				});
				const cardNumbersFieldData = cardNumbersField.useFieldData();

				return () => {
					return [
						h(
							"div",
							{
								"data-testid": `usernameData[${props.index}]`,
							},
							{
								default: () => JSON.stringify(usernameData.value),
							}
						),
						h(
							"div",
							{
								"data-testid": `cardNumbersData[${props.index}]`,
							},
							{
								default: () => JSON.stringify(cardNumbersFieldData.value),
							}
						),
					];
				};
			},
		};

		const InnerField = {
			props: {
				index: {
					type: Number,
					required: true,
				},
			},
			setup(props: { index: number }) {
				const fieldArray = useInjectFieldArray<FormData["users"], FormData>();
				const cardNumbersField = fieldArray.useFieldArray({
					name: "cardNumbers",
					index: props.index,
				});

				return () => {
					return [
						h(
							fieldArray.Field,
							{ name: "username", index: props.index },
							{
								default: () =>
									h(EzBindingFieldInput, null, {
										default: () => [
											h("input", {
												"data-testid": `usernameInput[${props.index}]`,
											}),
										],
									}),
							}
						),
						h(
							fieldArray.FieldArray,
							{ name: "cardNumbers", index: props.index },
							{
								default: ({ fieldsInfo }: { fieldsInfo: unknown[] }) => [
									h(
										"div",
										fieldsInfo.map((_, index) => {
											return h(
												cardNumbersField.Field,
												{ index },
												{
													default: () => [
														h(EzBindingFieldInput, null, {
															default: () => [
																h("input", {
																	"data-testid": `cardNumberInput[${props.index}][${index}]`,
																}),
															],
														}),
													],
												}
											);
										})
									),
								],
							}
						),
					];
				};
			},
		};

		render({
			setup() {
				const form = useForm({
					initialValues: formData,
				});

				return () => {
					return h(form.Form, null, {
						default: () => [
							h(
								form.FieldArray,
								{
									name: "users",
								},
								{
									default: ({ fieldsInfo }: { fieldsInfo: unknown[] }) => [
										h("div", null, {
											default: () =>
												fieldsInfo.map((_, index) => {
													return [
														h(InnerField, { index }),
														h(InnerFieldData, { index }),
													];
												}),
										}),
										h(UsersFieldMeta),
									],
								}
							),
						],
					});
				};
			},
		});

		const usernameInput = screen.getByTestId("usernameInput[0]");
		expect(usernameInput).toBeInTheDocument();
		await userEvent.type(usernameInput, "johnson");

		const usernameDataEl = screen.getByTestId("usernameData[0]");
		const usernameData = usernameDataEl.innerHTML;
		expect(usernameData).toMatch('"value":"johnson"');

		const cardNumberInput = screen.getByTestId("cardNumberInput[0][0]");
		expect(cardNumberInput).toBeInTheDocument();
		expect(cardNumberInput).toHaveValue("123");
		await userEvent.type(cardNumberInput, "456");

		const cardNumbersDataEl = screen.getByTestId("cardNumbersData[0]");
		const cardNumbersData = cardNumbersDataEl.innerHTML;
		expect(cardNumbersData).toMatch('"value":["123456"]');
	});
});
