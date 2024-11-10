import { FieldInstance, FormInstance } from "@ez-kits/form-core";
import { zodValidator } from "src/index";
import { describe, it } from "vitest";
import { z } from "zod";

describe("Async validator", () => {
	it("Empty error message", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm, z.Schema>({
			validator: zodValidator,
			validationSchema: z.object({
				username: z.string().length(6, ""),
				password: z
					.string()
					.regex(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")),
			}),
		});
		const userName = new FieldInstance<string, LoginForm, z.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, LoginForm, z.Schema>(form, {
			name: "password",
		});
		userName.mount();
		password.mount();

		userName.handleChange("johnson");
		password.handleChange("123456");

		form.validate({ trigger: "change" }).then(({ valid, errors }) => {
			expect(valid).toBe(false);
			expect(errors.length).toBe(2);
		});
	});

	it("Field level - Nested field value", ({ expect }) => {
		interface AddressForm {
			username: string;
			address: {
				line1: string;
				line2: string;
			};
		}
		const formData: AddressForm = {
			username: "johnson",
			address: {
				line1: "",
				line2: "",
			},
		};

		const form = new FormInstance<AddressForm, z.Schema>({
			validator: zodValidator,
		});
		const userName = new FieldInstance<string, AddressForm, z.Schema>(form, {
			name: "username",
		});
		const address = new FieldInstance<string, AddressForm, z.Schema>(form, {
			name: "address",
			validationSchema: z.object({
				line1: z.string().min(1),
				line2: z.string().min(1),
			}),
		});

		userName.mount();
		address.mount();

		userName.handleChange(formData.username);
		address.handleChange(formData.address);

		form.validate({ trigger: "change" }).then(({ valid, errors }) => {
			expect(valid).toBe(false);
			expect(errors.length).toBe(2);
		});
	});
});
