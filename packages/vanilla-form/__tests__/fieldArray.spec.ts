import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createForm } from "src/index";
import { describe } from "vitest";

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

	it("Push", async () => {
		const user: User = {
			username: "user 1",
			password: "secret_password",
		};

		document.body.innerHTML = `
			<form id="usersForm">
				<div id="users">
				</div>
				<button
					data-testid="action_btn"
					id="action-button"
				>
					Add user
				</button>
			</form>
		`;

		const form = createForm<UsersForm>({
			el: "#usersForm",
			initialValues: { ...formData },
		});

		const fieldArray = form.createFieldArray({
			el: "#users",
			name: "users",
			itemTemplate(index) {
				const itemEl = document.createElement("div");

				itemEl.innerHTML = `
					<input
						data-testid="users.username.${index}"
						name="users.${index}.username"
					/>
					<input
						data-testid="users.password.${index}"
						name="users.${index}.password"
						type="password"
					/>
				`;

				return itemEl;
			},
			itemFieldsCreator(index, fieldArray) {
				return [
					fieldArray.createField({
						name: "username",
						index,
					}),
					fieldArray.createField({
						name: "password",
						index,
					}),
				];
			},
		});

		const actionButtonEl = document.getElementById("action-button");

		actionButtonEl?.addEventListener("click", () => {
			fieldArray.push(user);
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

	it("Pop", async () => {
		document.body.innerHTML = `
			<form id="usersForm">
				<div id="users">
				</div>
				<span data-testid="users_length" id="users-length"></span>
				<button
					data-testid="action_btn"
					id="action-button"
				>
					Pop user
				</button>
			</form>
		`;

		const form = createForm<UsersForm>({
			el: "#usersForm",
			initialValues: { ...formData },
		});

		const fieldArray = form.createFieldArray({
			el: "#users",
			name: "users",
			itemTemplate(index) {
				const itemEl = document.createElement("div");

				itemEl.innerHTML = `
					<input
						data-testid="users.username.${index}"
						name="users.${index}.username"
					/>
					<input
						data-testid="users.password.${index}"
						name="users.${index}.password"
						type="password"
					/>
				`;

				return itemEl;
			},
			itemFieldsCreator(index, fieldArray) {
				return [
					fieldArray.createField({
						name: "username",
						index,
					}),
					fieldArray.createField({
						name: "password",
						index,
					}),
				];
			},
		});

		const usersLengthEl = document.getElementById("users-length");
		if (usersLengthEl) {
			usersLengthEl.innerHTML = fieldArray.value.length.toString();
		}

		fieldArray.on("change:value", (values) => {
			if (usersLengthEl) {
				usersLengthEl.innerHTML = values.length.toString();
			}
		});

		const actionButtonEl = document.getElementById("action-button");

		actionButtonEl?.addEventListener("click", () => {
			fieldArray.pop();
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

	it("Insert", async () => {
		const newUser: User = {
			username: "User to insert",
			password: "Password",
		};

		document.body.innerHTML = `
			<form id="usersForm">
				<div id="users">
				</div>
				<span data-testid="users_length" id="users-length"></span>
				<button
					data-testid="action_btn"
					id="action-button"
				>
					Insert user
				</button>
			</form>
		`;

		const form = createForm<UsersForm>({
			el: "#usersForm",
			initialValues: { ...formData },
		});

		const fieldArray = form.createFieldArray({
			el: "#users",
			name: "users",
			itemTemplate(index) {
				const itemEl = document.createElement("div");

				itemEl.innerHTML = `
					<input
						data-testid="users.username.${index}"
						name="users.${index}.username"
					/>
					<input
						data-testid="users.password.${index}"
						name="users.${index}.password"
						type="password"
					/>
				`;

				return itemEl;
			},
			itemFieldsCreator(index, fieldArray) {
				return [
					fieldArray.createField({
						name: "username",
						index,
					}),
					fieldArray.createField({
						name: "password",
						index,
					}),
				];
			},
		});

		const usersLengthEl = document.getElementById("users-length");
		if (usersLengthEl) {
			usersLengthEl.innerHTML = fieldArray.value.length.toString();
		}

		fieldArray.on("change:value", (values) => {
			if (usersLengthEl) {
				usersLengthEl.innerHTML = values.length.toString();
			}
		});

		const actionButtonEl = document.getElementById("action-button");

		actionButtonEl?.addEventListener("click", () => {
			fieldArray.insert(2, newUser);
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

	it("Shift", async () => {
		document.body.innerHTML = `
			<form id="usersForm">
				<div id="users">
				</div>
				<span data-testid="users_length" id="users-length"></span>
				<button
					data-testid="action_btn"
					id="action-button"
				>
					Shift user
				</button>
			</form>
		`;

		const form = createForm<UsersForm>({
			el: "#usersForm",
			initialValues: { ...formData },
		});

		const fieldArray = form.createFieldArray({
			el: "#users",
			name: "users",
			itemTemplate(index) {
				const itemEl = document.createElement("div");

				itemEl.innerHTML = `
					<input
						data-testid="users.username.${index}"
						name="users.${index}.username"
					/>
					<input
						data-testid="users.password.${index}"
						name="users.${index}.password"
						type="password"
					/>
				`;

				return itemEl;
			},
			itemFieldsCreator(index, fieldArray) {
				return [
					fieldArray.createField({
						name: "username",
						index,
					}),
					fieldArray.createField({
						name: "password",
						index,
					}),
				];
			},
		});

		const usersLengthEl = document.getElementById("users-length");
		if (usersLengthEl) {
			usersLengthEl.innerHTML = fieldArray.value.length.toString();
		}

		fieldArray.on("change:value", (values) => {
			if (usersLengthEl) {
				usersLengthEl.innerHTML = values.length.toString();
			}
		});

		const actionButtonEl = document.getElementById("action-button");

		actionButtonEl?.addEventListener("click", () => {
			fieldArray.shift();
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

	it("Unshift", async () => {
		const user: User = {
			username: "user abc",
			password: "secret_password_abc",
		};

		document.body.innerHTML = `
			<form id="usersForm">
				<div id="users">
				</div>
				<span data-testid="users_length" id="users-length"></span>
				<button
					data-testid="action_btn"
					id="action-button"
				>
					Unshift user
				</button>
			</form>
		`;

		const form = createForm<UsersForm>({
			el: "#usersForm",
			initialValues: { ...formData },
		});

		const fieldArray = form.createFieldArray({
			el: "#users",
			name: "users",
			itemTemplate(index) {
				const itemEl = document.createElement("div");

				itemEl.innerHTML = `
					<input
						data-testid="users.username.${index}"
						name="users.${index}.username"
					/>
					<input
						data-testid="users.password.${index}"
						name="users.${index}.password"
						type="password"
					/>
				`;

				return itemEl;
			},
			itemFieldsCreator(index, fieldArray) {
				return [
					fieldArray.createField({
						name: "username",
						index,
					}),
					fieldArray.createField({
						name: "password",
						index,
					}),
				];
			},
		});

		const usersLengthEl = document.getElementById("users-length");
		if (usersLengthEl) {
			usersLengthEl.innerHTML = fieldArray.value.length.toString();
		}

		fieldArray.on("change:value", (values) => {
			if (usersLengthEl) {
				usersLengthEl.innerHTML = values.length.toString();
			}
		});

		const actionButtonEl = document.getElementById("action-button");

		actionButtonEl?.addEventListener("click", () => {
			fieldArray.unshift(user);
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

	it("Replace", async () => {
		const user: User = {
			username: "user abc",
			password: "secret_password_abc",
		};

		document.body.innerHTML = `
			<form id="usersForm">
				<div id="users">
				</div>
				<span data-testid="users_length" id="users-length"></span>
				<button
					data-testid="action_btn"
					id="action-button"
				>
					Replace user
				</button>
			</form>
		`;

		const form = createForm<UsersForm>({
			el: "#usersForm",
			initialValues: { ...formData },
		});

		const fieldArray = form.createFieldArray({
			el: "#users",
			name: "users",
			itemTemplate(index) {
				const itemEl = document.createElement("div");

				itemEl.innerHTML = `
					<input
						data-testid="users.username.${index}"
						name="users.${index}.username"
					/>
					<input
						data-testid="users.password.${index}"
						name="users.${index}.password"
						type="password"
					/>
				`;

				return itemEl;
			},
			itemFieldsCreator(index, fieldArray) {
				return [
					fieldArray.createField({
						name: "username",
						index,
					}),
					fieldArray.createField({
						name: "password",
						index,
					}),
				];
			},
		});

		const usersLengthEl = document.getElementById("users-length");
		if (usersLengthEl) {
			usersLengthEl.innerHTML = fieldArray.value.length.toString();
		}

		fieldArray.on("change:value", (values) => {
			if (usersLengthEl) {
				usersLengthEl.innerHTML = values.length.toString();
			}
		});

		const actionButtonEl = document.getElementById("action-button");

		actionButtonEl?.addEventListener("click", () => {
			fieldArray.replace(0, user);
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

	it("Remove", async () => {
		document.body.innerHTML = `
			<form id="usersForm">
				<div id="users">
				</div>
				<span data-testid="users_length" id="users-length"></span>
				<button
					data-testid="action_btn"
					id="action-button"
				>
					Remove user
				</button>
			</form>
		`;

		const form = createForm<UsersForm>({
			el: "#usersForm",
			initialValues: { ...formData },
		});

		const fieldArray = form.createFieldArray({
			el: "#users",
			name: "users",
			itemTemplate(index) {
				const itemEl = document.createElement("div");

				itemEl.innerHTML = `
					<input
						data-testid="users.username.${index}"
						name="users.${index}.username"
					/>
					<input
						data-testid="users.password.${index}"
						name="users.${index}.password"
						type="password"
					/>
				`;

				return itemEl;
			},
			itemFieldsCreator(index, fieldArray) {
				return [
					fieldArray.createField({
						name: "username",
						index,
					}),
					fieldArray.createField({
						name: "password",
						index,
					}),
				];
			},
		});

		const usersLengthEl = document.getElementById("users-length");
		if (usersLengthEl) {
			usersLengthEl.innerHTML = fieldArray.value.length.toString();
		}

		fieldArray.on("change:value", (values) => {
			if (usersLengthEl) {
				usersLengthEl.innerHTML = values.length.toString();
			}
		});

		const actionButtonEl = document.getElementById("action-button");

		actionButtonEl?.addEventListener("click", () => {
			fieldArray.remove(0);
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

	it("Move", async () => {
		document.body.innerHTML = `
			<form id="usersForm">
				<div id="users">
				</div>
				<span data-testid="users_length" id="users-length"></span>
				<button
					data-testid="action_btn"
					id="action-button"
				>
					Move user
				</button>
			</form>
		`;

		const form = createForm<UsersForm>({
			el: "#usersForm",
			initialValues: { ...formData },
		});

		const fieldArray = form.createFieldArray({
			el: "#users",
			name: "users",
			itemTemplate(index) {
				const itemEl = document.createElement("div");

				itemEl.innerHTML = `
					<input
						data-testid="users.username.${index}"
						name="users.${index}.username"
					/>
					<input
						data-testid="users.password.${index}"
						name="users.${index}.password"
						type="password"
					/>
				`;

				return itemEl;
			},
			itemFieldsCreator(index, fieldArray) {
				return [
					fieldArray.createField({
						name: "username",
						index,
					}),
					fieldArray.createField({
						name: "password",
						index,
					}),
				];
			},
		});

		const usersLengthEl = document.getElementById("users-length");
		if (usersLengthEl) {
			usersLengthEl.innerHTML = fieldArray.value.length.toString();
		}

		fieldArray.on("change:value", (values) => {
			if (usersLengthEl) {
				usersLengthEl.innerHTML = values.length.toString();
			}
		});

		const actionButtonEl = document.getElementById("action-button");

		actionButtonEl?.addEventListener("click", () => {
			fieldArray.move(0, 9);
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

	it("Swap", async () => {
		document.body.innerHTML = `
			<form id="usersForm">
				<div id="users">
				</div>
				<span data-testid="users_length" id="users-length"></span>
				<button
					data-testid="action_btn"
					id="action-button"
				>
					Pop user
				</button>
			</form>
		`;

		const form = createForm<UsersForm>({
			el: "#usersForm",
			initialValues: { ...formData },
		});

		const fieldArray = form.createFieldArray({
			el: "#users",
			name: "users",
			itemTemplate(index) {
				const itemEl = document.createElement("div");

				itemEl.innerHTML = `
					<input
						data-testid="users.username.${index}"
						name="users.${index}.username"
					/>
					<input
						data-testid="users.password.${index}"
						name="users.${index}.password"
						type="password"
					/>
				`;

				return itemEl;
			},
			itemFieldsCreator(index, fieldArray) {
				return [
					fieldArray.createField({
						name: "username",
						index,
					}),
					fieldArray.createField({
						name: "password",
						index,
					}),
				];
			},
		});

		const usersLengthEl = document.getElementById("users-length");
		if (usersLengthEl) {
			usersLengthEl.innerHTML = fieldArray.value.length.toString();
		}

		fieldArray.on("change:value", (values) => {
			if (usersLengthEl) {
				usersLengthEl.innerHTML = values.length.toString();
			}
		});

		const actionButtonEl = document.getElementById("action-button");

		actionButtonEl?.addEventListener("click", () => {
			fieldArray.swap(0, 9);
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
});

// describe("FieldArray - Others", () => {
// 	it("Nested Field", async ({ expect }) => {
// 		document.body.innerHTML = `
// 			<form id="usersForm">
// 				<div id="users">
// 				</div>
// 				<span data-testid="users_length" id="users-length"></span>
// 				<button
// 					data-testid="action_btn"
// 					id="action-button"
// 				>
// 					Pop user
// 				</button>
// 			</form>
// 		`;

// 		const formData = {
// 			users: [
// 				{
// 					username: "",
// 					cardNumbers: ["123"],
// 				},
// 			],
// 		};

// 		type UsersForm = typeof formData;

// 		const form = createForm<UsersForm>({
// 			el: "#usersForm",
// 			initialValues: formData,
// 		});

// 		form.createFieldArray({
// 			name: "users",
// 			el: "#users",
// 			itemTemplate(index) {
// 				const itemEl = document.createElement("div");

// 				itemEl.innerHTML = `
// 					<input
// 						data-testid="users.username.${index}"
// 						name="users.${index}.username"
// 					/>
// 					<div id="cardNumbers${index}">
// 					</div>
// 				`;

// 				return itemEl;
// 			},
// 			itemFieldsCreator(index, fieldArray) {
// 				return [
// 					fieldArray.createField({
// 						name: "username",
// 						index,
// 					}),
// 					fieldArray.createFieldArray({
// 						name: "cardNumbers",
// 						index,
// 						el: `#cardNumbers${index}`,
// 						itemTemplate(index) {
// 							const itemEl = document.createElement("div");

// 							itemEl.innerHTML = `
// 								<input
// 									data-testid="users.cardNumbers.${index}"
// 									name="users.${index}.username"
// 								/>
// 							`;

// 							return itemEl;
// 						},
// 						itemFieldsCreator(index, fieldArray) {
// 							return [
// 								fieldArray.createField({
// 									name: `${index}`,
// 									index,
// 								}),
// 								form.createField({
// 									name: "users",
// 								}),
// 							];
// 						},
// 					}),
// 				];
// 			},
// 		});
// 	});
// });
