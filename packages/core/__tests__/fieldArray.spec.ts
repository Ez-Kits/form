import { yupValidator } from "@ez-kits/form-yup-validator";
import FieldInstance from "src/Field";
import FieldArrayInstance from "src/FieldArray";
import FormInstance from "src/Form";
import { clone } from "src/utilities";
import { describe, it } from "vitest";
import * as yup from "yup";

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
					username: "user_" + (index + 1),
					password: "secret_password",
				};
			}),
	};

	const form = new FormInstance<UsersForm, unknown>({
		initialValues: clone(formData),
	});
	const usersField = new FieldArrayInstance<User[], UsersForm, unknown>(form, {
		name: "users",
	});

	form.mount();
	usersField.mount();

	it("Push", ({ expect }) => {
		const user: User = {
			username: "user 1",
			password: "secret_password",
		};
		let fieldsInfo = usersField.getFieldsInfo();
		expect(fieldsInfo.length).toBe(formData.users.length);

		usersField.push(user);
		fieldsInfo = usersField.getFieldsInfo();

		expect(form.getValues()).toMatchObject({
			users: [...formData.users, user],
		});
		expect(usersField.getItemValue(formData.users.length)).toEqual(user);
		expect(fieldsInfo.length).toBe(formData.users.length + 1);
	});

	it("Pop", ({ expect }) => {
		form.reset();
		let fieldsInfo = usersField.getFieldsInfo();
		expect(fieldsInfo.length).toBe(formData.users.length);

		usersField.pop();
		const users = formData.users.slice(0);
		users.pop();
		fieldsInfo = usersField.getFieldsInfo();

		expect(form.getValues()).toMatchObject({
			users: users,
		});
		expect(usersField.getItemValue(formData.users.length - 1)).toEqual(
			undefined
		);
		expect(fieldsInfo.length).toBe(formData.users.length - 1);
	});

	it("Insert", ({ expect }) => {
		const user: User = {
			username: "user 1",
			password: "secret_password",
		};
		form.reset();
		let fieldsInfo = usersField.getFieldsInfo();
		expect(fieldsInfo.length).toBe(formData.users.length);

		usersField.insert(5, user);
		const users = formData.users.slice(0);
		users.splice(5, 0, user);
		fieldsInfo = usersField.getFieldsInfo();

		expect(form.getValues()).toMatchObject({
			users: users,
		});
		expect(usersField.getItemValue(5)).toEqual(user);
		expect(fieldsInfo.length).toBe(formData.users.length + 1);
	});

	it("Shift", ({ expect }) => {
		form.reset();
		let fieldsInfo = usersField.getFieldsInfo();
		expect(fieldsInfo.length).toBe(formData.users.length);

		usersField.shift();
		const users = formData.users.slice(0);
		users.shift();
		fieldsInfo = usersField.getFieldsInfo();

		expect(form.getValues()).toMatchObject({
			users: users,
		});
		expect(usersField.getItemValue(0)).toEqual(formData.users[1]);
		expect(fieldsInfo.length).toBe(formData.users.length - 1);
	});

	it("Unshift", ({ expect }) => {
		const user: User = {
			username: "user 1",
			password: "secret_password",
		};
		form.reset();
		let fieldsInfo = usersField.getFieldsInfo();
		expect(fieldsInfo.length).toBe(formData.users.length);

		usersField.unshift(user);
		fieldsInfo = usersField.getFieldsInfo();

		expect(form.getValues()).toMatchObject({
			users: [user, ...formData.users],
		});
		expect(usersField.getItemValue(0)).toEqual(user);
		expect(fieldsInfo.length).toBe(formData.users.length + 1);
	});

	it("Replace", ({ expect }) => {
		const user: User = {
			username: "user 1",
			password: "secret_password",
		};
		form.reset();
		let fieldsInfo = usersField.getFieldsInfo();
		expect(fieldsInfo.length).toBe(formData.users.length);

		usersField.replace(2, user);
		const users = formData.users.slice(0);
		users.splice(2, 1, user);
		fieldsInfo = usersField.getFieldsInfo();

		expect(form.getValues()).toMatchObject({
			users: users,
		});
		expect(usersField.getItemValue(2)).toEqual(user);
		expect(fieldsInfo.length).toBe(formData.users.length);
	});

	it("Remove", ({ expect }) => {
		form.reset();
		usersField.remove(2);

		const users = formData.users.slice(0);
		users.splice(2, 1);

		expect(form.getValues()).toMatchObject({
			users: users,
		});
		expect(usersField.getItemValue(2)).toEqual(formData.users[3]);
	});

	it("Move", ({ expect }) => {
		form.reset();
		usersField.move(2, 5);

		const users = formData.users.slice(0);
		const temp = users[2] as User;
		users.splice(2, 1);
		users.splice(5, 0, temp);

		expect(form.getValues()).toMatchObject({
			users: users,
		});
		expect(usersField.getItemValue(5)).toEqual(formData.users[2]);
	});

	it("Swap", ({ expect }) => {
		form.reset();
		usersField.swap(2, 5);

		const users = formData.users.slice(0);
		const temp = users[2] as User;
		users[2] = users[5] as User;
		users[5] = temp;

		expect(form.getValues()).toMatchObject({
			users: users,
		});
		expect(usersField.getItemValue(2)).toEqual(formData.users[5]);
		expect(usersField.getItemValue(5)).toEqual(formData.users[2]);
	});

	it("Get item instances", ({ expect }) => {
		form.reset();
		const itemFields = formData.users.map((_, index) => {
			return [
				new FieldInstance(form, {
					name: `users.${index}.username`,
				}),
				new FieldInstance(form, {
					name: `users.${index}.password`,
				}),
			];
		});

		itemFields.forEach((fields, index) => {
			fields[0]?.mount();
			fields[1]?.mount();
		});

		expect(usersField.getItemFieldInstances(2)).toEqual(itemFields[2]);
	});

	it("Swap", ({ expect }) => {
		form.reset();
		usersField.swap(2, 5);

		const users = formData.users.slice(0);
		const temp = users[2] as User;
		users[2] = users[5] as User;
		users[5] = temp;

		expect(form.getValues()).toMatchObject({
			users: users,
		});
		expect(usersField.getItemValue(2)).toEqual(formData.users[5]);
		expect(usersField.getItemValue(5)).toEqual(formData.users[2]);
	});
});

describe("Field Array - Validation", () => {
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
					username: "user_" + (index + 1),
					password: "secret_password",
				};
			}),
	};

	const form = new FormInstance<UsersForm, yup.Schema>({
		initialValues: clone(formData),
		validator: yupValidator,
	});
	const usersField = new FieldArrayInstance<User[], UsersForm, yup.Schema>(
		form,
		{
			name: "users",
			validationSchema: yup.array().of(
				yup.object().shape({
					username: yup.string().required(),
					password: yup.string().required(),
				})
			),
		}
	);

	form.mount();
	usersField.mount();

	it("Invalid validation", async ({ expect }) => {
		usersField.push({
			username: "",
			password: "",
		});

		await usersField.validate({
			trigger: "change",
		});

		const errors = usersField.getItemErrors(usersField.value.length - 1);
		expect(errors.length).toBe(2);
	});
});
