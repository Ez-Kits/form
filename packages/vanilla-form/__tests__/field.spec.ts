import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createForm } from "src/index";
import { describe, it } from "vitest";

describe("Field", () => {
	it("Nested Field", ({ expect }) => {
		document.body.innerHTML = `
			<form id="usersForm">
				<input
					data-testid="user.username"
					name="user.username"
				/>
				<div id="cardNumbers">
				</div>
			</form>
		`;

		const formData = {
			user: {
				username: "",
				cardNumbers: ["123"],
			},
		};

		type UsersForm = typeof formData;

		const form = createForm<UsersForm>({
			el: "#usersForm",
			initialValues: formData,
		});

		const userField = form.createField({
			name: "user",
			autoBinding: false,
		});

		userField.createField({
			name: `username`,
		}),
			userField.createFieldArray({
				name: `cardNumbers`,
				el: `#cardNumbers`,
				itemTemplate(index) {
					const itemEl = document.createElement("div");

					itemEl.innerHTML = `
						<input
							data-testid="user.cardNumbers.${index}"
							name="user.cardNumbers.[${index}]"
						/>
					`;

					return itemEl;
				},
				itemFieldsCreator(index, fieldArray) {
					return [
						fieldArray.createField({
							name: `[${index}]`,
						}),
					];
				},
			});

		const usernameEl = screen.getByTestId("user.username");
		const cardNumbersEl = screen.getByTestId("user.cardNumbers.0");

		expect(usernameEl).toBeInTheDocument();
		expect(cardNumbersEl).toBeInTheDocument();

		expect(usernameEl).toHaveValue(formData.user.username);
		expect(cardNumbersEl).toHaveValue(formData.user.cardNumbers[0]);
	});

	it("Handle Input", async ({ expect }) => {
		document.body.innerHTML = `
			<form id="userForm">
				<input
					data-testid="user.username"
					name="user.username"
				/>
			</form>
		`;

		const formData = {
			user: {
				username: "johnson",
			},
		};

		const form = createForm({
			el: "#userForm",
			initialValues: formData,
		});

		const usernameField = form.createField({
			name: "user.username",
			handleInput(field) {
				const input = document.querySelector(
					`[name="${field.name}"]`
				) as HTMLInputElement;
				input.value = field.getValue();

				input.addEventListener("input", (e) => {
					field.handleChange(e);
				});

				input.addEventListener("blur", (e) => {
					field.handleBlur(e);
				});

				field.on("change:value", (value) => {
					input.value = value;
				});
			},
		});

		const usernameEl = screen.getByTestId("user.username");

		expect(usernameEl).toBeInTheDocument();
		expect(usernameEl).toHaveValue(formData.user.username);

		await userEvent.type(usernameEl, "_2");

		expect(usernameEl).toHaveValue("johnson_2");
		expect(usernameField.getValue()).toBe("johnson_2");
	});

	it("Custom Input Selector", async ({ expect }) => {
		document.body.innerHTML = `
			<form id="userForm">
				<input
					data-testid="user.username"
					name="user.username"
					id="user-username"
				/>
			</form>
		`;

		const formData = {
			user: {
				username: "johnson",
			},
		};

		const form = createForm({
			el: "#userForm",
			initialValues: formData,
		});

		const usernameField = form.createField({
			name: "user.username",
			inputEl: "#user-username",
		});

		const usernameEl = screen.getByTestId("user.username");

		expect(usernameEl).toBeInTheDocument();
		expect(usernameEl).toHaveValue(formData.user.username);

		await userEvent.type(usernameEl, "_2");
		usernameEl.blur();

		expect(usernameEl).toHaveValue("johnson_2");
		expect(usernameField.getValue()).toBe("johnson_2");
	});

	it("Custom Input Selector - Not Found", ({ expect }) => {
		document.body.innerHTML = `
			<form id="userForm">
				<input
					data-testid="user.username"
					name="user.username"
					id="user-username"
				/>
			</form>
		`;

		const formData = {
			user: {
				username: "johnson",
			},
		};

		const form = createForm({
			el: "#userForm",
			initialValues: formData,
		});

		expect(() => {
			form.createField({
				name: "user.username",
				inputEl: "#user-username-not-found",
			});
		}).toThrowError();
	});
});
