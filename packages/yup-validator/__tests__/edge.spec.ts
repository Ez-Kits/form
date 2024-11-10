import { FieldInstance, FormInstance } from "@ez-kits/form-core";
import { yupValidator } from "src/index";
import { describe, it } from "vitest";
import * as yup from "yup";

describe("Async validator", () => {
	it("Empty error message", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm, yup.Schema>({
			validator: yupValidator,
			validationSchema: yup.object({
				username: yup.string().required("").length(6, ""),
				password: yup
					.string()
					.required()
					.matches(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")),
			}),
		});
		const userName = new FieldInstance<string, LoginForm, yup.Schema>(form, {
			name: "username",
		});
		const password = new FieldInstance<string, LoginForm, yup.Schema>(form, {
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

		const form = new FormInstance<AddressForm, yup.Schema>({
			validator: yupValidator,
		});
		const userName = new FieldInstance<string, AddressForm, yup.Schema>(form, {
			name: "username",
		});
		const address = new FieldInstance<string, AddressForm, yup.Schema>(form, {
			name: "address",
			validationSchema: yup.object({
				line1: yup.string().required(),
				line2: yup.string().required(),
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
