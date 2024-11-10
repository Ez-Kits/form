import { FieldInstance, FormInstance } from "@ez-kits/form-core";
import { valibotValidator } from "src/index";
import * as v from "valibot";
import { describe, it } from "vitest";

describe("Async validator", () => {
	it("Empty error message", ({ expect }) => {
		interface LoginForm {
			username: string;
			password: string;
		}

		const form = new FormInstance<LoginForm, v.GenericSchema>({
			validator: valibotValidator,
			validationSchema: v.object({
				username: v.pipe(v.string(), v.length(6)),
				password: v.pipe(
					v.string(),
					v.regex(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$"))
				),
			}),
		});
		const userName = new FieldInstance<string, LoginForm, v.GenericSchema>(
			form,
			{
				name: "username",
			}
		);
		const password = new FieldInstance<string, LoginForm, v.GenericSchema>(
			form,
			{
				name: "password",
			}
		);
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

		const form = new FormInstance<AddressForm, v.GenericSchema>({
			validator: valibotValidator,
		});
		const userName = new FieldInstance<string, AddressForm, v.GenericSchema>(
			form,
			{
				name: "username",
			}
		);
		const address = new FieldInstance<string, AddressForm, v.GenericSchema>(
			form,
			{
				name: "address",
				validationSchema: v.object({
					line1: v.pipe(v.string(), v.length(6)),
					line2: v.pipe(v.string(), v.length(6)),
				}),
			}
		);

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
