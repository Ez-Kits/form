import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createForm } from "src/index";
import { describe, it } from "vitest";

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

		document.body.innerHTML = `
			<form id="loginForm">
				<input data-testid="usernameInput" name="username" />
				<input data-testid="passwordInput" name="password" type="password" />
			</form>
		`;

		const form = createForm<LoginForm>({
			el: "#loginForm",
		});

		form.createField({
			name: "password",
		});
		form.createField({
			name: "username",
		});

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

		document.body.innerHTML = `
			<form id="loginForm">
				<input data-testid="usernameInput" name="username" />
				<input data-testid="passwordInput" name="password" type="password" />
			</form>
		`;

		const form = createForm<LoginForm>({
			el: "#loginForm",
			initialValues: loginFormData,
		});

		form.createField({
			name: "password",
		});
		form.createField({
			name: "username",
		});

		const usernameInput = screen.getByTestId("usernameInput");
		const passwordInput = screen.getByTestId("passwordInput");

		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(usernameInput).toHaveValue(loginFormData.username);
		expect(passwordInput).toHaveValue(loginFormData.password);

		await userEvent.type(usernameInput, "_2");
		await userEvent.type(passwordInput, "_2");

		expect(usernameInput).toHaveValue(loginFormData.username + "_2");
		expect(passwordInput).toHaveValue(loginFormData.password + "_2");
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

		document.body.innerHTML = `
			<form id="registerForm">
				<input data-testid="usernameInput" name="username" />
				<input data-testid="passwordInput" type="password" name="password" />
				<input data-testid="confirmPasswordInput" type="password" name="confirmPassword" />
				<input data-testid="addressLineOneInput" name="address.lineOne" />
				<input data-testid="addressLineTwoInput" name="address.lineTwo" />
			</form>
		`;

		const form = createForm<RegisterForm>({
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
		form.createField({
			name: "password",
		});
		form.createField({
			name: "confirmPassword",
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

		document.body.innerHTML = `
			<form id="registerForm">
				<input data-testid="usernameInput" name="username" />
				<input data-testid="passwordInput" type="password" name="password" />
				<input data-testid="confirmPasswordInput" type="password" name="confirmPassword" />
				<input data-testid="addressLineOneInput" name="address.lineOne" />
				<input data-testid="addressLineTwoInput" name="address.lineTwo" />
				<span data-testid="observeUsername" id="observeUsername">{value}</span>
			</form>
		`;

		const form = createForm<RegisterForm>({
			el: "#registerForm",
			initialValues: formData,
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
		form.createField({
			name: "password",
		});
		form.createField({
			name: "confirmPassword",
		});

		form.on("change:value", (values) => {
			const el = document.getElementById("observeUsername");
			if (el) {
				el.innerHTML = values.username;
			}
		});

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
});

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
