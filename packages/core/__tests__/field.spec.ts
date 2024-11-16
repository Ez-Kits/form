import userEvent from "@testing-library/user-event";
import FieldInstance from "src/Field";
import FormInstance from "src/Form";
import { describe, it, vi } from "vitest";
import * as yup from "yup";
import { yupValidator } from "./yup-validator";

describe("Field - Basic", () => {
	it("Handle change - Input", async ({ expect }) => {
		const input = document.createElement("input");
		document.body.append(input);

		const onChange = vi.fn(() => {});
		const form = new FormInstance();
		const field = new FieldInstance(form, { name: "test", onChange });
		expect(field).toBeInstanceOf(FieldInstance);

		const unmount = field.mount();

		input.addEventListener("input", (e) => {
			field.handleChange(e);
		});

		await userEvent.type(input, "test");
		expect(field.getValue()).toBe("test");
		expect(onChange).toHaveBeenCalled();

		unmount();
	});

	it("Handle change - Checkbox/radio", async ({ expect }) => {
		const input = document.createElement("input");
		input.type = "checkbox";
		document.body.append(input);

		const form = new FormInstance();
		const field = new FieldInstance(form, { name: "test" });
		expect(field).toBeInstanceOf(FieldInstance);

		const unmount = field.mount();

		input.addEventListener("input", (e) => {
			field.handleChange(e);
		});

		await userEvent.click(input);
		expect(field.getValue()).toBe(true);

		unmount();
	});

	it("Handle blur", async ({ expect }) => {
		const input = document.createElement("input");
		document.body.append(input);

		const onBlur = vi.fn(() => {});
		const form = new FormInstance();
		const field = new FieldInstance(form, { name: "test", onBlur });
		expect(field).toBeInstanceOf(FieldInstance);

		const unmount = field.mount();

		input.addEventListener("change", (e) => {
			field.handleChange(e);
		});

		input.addEventListener("blur", (e) => {
			field.handleBlur(e);
		});

		await userEvent.type(input, "test");
		input.blur();
		expect(field.getValue()).toBe("test");
		expect(onBlur).toHaveBeenCalled();

		unmount();
	});

	it("Reset field", async ({ expect }) => {
		const input = document.createElement("input");
		document.body.append(input);

		const form = new FormInstance();
		const field = new FieldInstance(form, { name: "test" });
		expect(field).toBeInstanceOf(FieldInstance);

		const unmount = field.mount();

		input.addEventListener("change", (e) => {
			field.handleChange(e);
		});

		await userEvent.type(input, "test");
		input.blur();
		expect(field.getValue()).toBe("test");

		field.reset();

		expect(field.getValue()).toBe(undefined);
		unmount();
	});

	it("Change field name", async ({ expect }) => {
		const form = new FormInstance({
			initialValues: {
				test: "test",
				test_2: "test_2",
			},
		});
		const field = new FieldInstance(form, { name: "test" });
		expect(field).toBeInstanceOf(FieldInstance);

		const unmount = field.mount();

		expect(field.getValue()).toBe("test");
		field.updateOptions({ name: "test_2" });
		expect(field.getValue()).toBe("test_2");

		unmount();
	});
});

describe("Field - Validation", () => {
	it("Validate without validator", async ({ expect }) => {
		const input = document.createElement("input");
		document.body.append(input);

		const form = new FormInstance<unknown, yup.Schema>();
		const field = new FieldInstance(form, { name: "test" });
		expect(field).toBeInstanceOf(FieldInstance);

		const unmount = field.mount();

		field.validate({
			trigger: "change",
		});
		expect(field.meta.errors).toStrictEqual([]);
		unmount();
	});

	it("Validate without validation schema", async ({ expect }) => {
		const input = document.createElement("input");
		document.body.append(input);

		const form = new FormInstance<unknown, yup.Schema>({
			validator: yupValidator,
		});
		const field = new FieldInstance(form, {
			name: "test",
		});
		expect(field).toBeInstanceOf(FieldInstance);

		const unmount = field.mount();

		await field.validate({
			trigger: "change",
		});
		expect(field.meta.errors).toStrictEqual([]);
		unmount();
	});

	it("Validate with validation schema function", async ({ expect }) => {
		const input = document.createElement("input");
		document.body.append(input);

		const form = new FormInstance<unknown, yup.Schema>({
			validator: yupValidator,
		});
		const field = new FieldInstance(form, {
			name: "test",
			validationSchema: () => yup.string().required(),
		});
		expect(field).toBeInstanceOf(FieldInstance);

		const unmount = field.mount();

		await field.validate({
			trigger: "change",
		});
		expect(field.meta.errors?.length).toEqual(1);
		unmount();
	});

	it("Cancel validation", async ({ expect }) => {
		const input = document.createElement("input");
		document.body.append(input);

		const form = new FormInstance<unknown, yup.Schema>({
			validator: yupValidator,
		});
		const field = new FieldInstance(form, {
			name: "test",
			validationSchema: () => yup.string().required(),
		});
		expect(field).toBeInstanceOf(FieldInstance);

		const unmount = field.mount();

		field.validate({
			trigger: "change",
		});
		field.cancelValidate();
		expect(field.meta.errors).toEqual(undefined);
		unmount();
	});

	it("Valid validation", async ({ expect }) => {
		const input = document.createElement("input");
		document.body.append(input);

		const form = new FormInstance<unknown, yup.Schema>({
			validator: yupValidator,
		});
		const field = new FieldInstance(form, {
			name: "test",
			validationSchema: [yup.string().required()],
		});
		expect(field).toBeInstanceOf(FieldInstance);

		const unmount = field.mount();

		field.handleChange("test");

		field.validate({
			trigger: "change",
		});
		expect(field.meta.errors?.length).toEqual(0);
		unmount();
	});

	it("Clear validation", async ({ expect }) => {
		const input = document.createElement("input");
		document.body.append(input);

		const form = new FormInstance<unknown, yup.Schema>({
			validator: yupValidator,
		});
		const field = new FieldInstance(form, {
			name: "test",
			validationSchema: {
				onChange: yup.string().required(),
			},
		});
		expect(field).toBeInstanceOf(FieldInstance);

		const unmount = field.mount();

		await field.validate({
			trigger: "change",
		});
		expect(field.meta.errors?.length).toEqual(1);
		field.clearValidate();
		expect(field.meta.errors).toEqual([]);
		unmount();
	});

	it("Validate message with label", async ({ expect }) => {
		const input = document.createElement("input");
		document.body.append(input);

		const form = new FormInstance<unknown, yup.Schema>({
			validator: yupValidator,
		});
		const field = new FieldInstance(form, {
			name: "test",
			label: "Test",
			validationSchema: () => yup.string().required(),
		});
		expect(field).toBeInstanceOf(FieldInstance);

		const unmount = field.mount();

		await field.validate({
			trigger: "change",
		});

		expect(field.meta.errors?.length).toBe(1);
		field.clearValidate();
		expect(field.meta.errors).toEqual([]);
		unmount();
	});
});
