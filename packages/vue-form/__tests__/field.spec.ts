import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import { EzBindingFieldInput, useForm, useInjectField } from "src/index";
import { describe, it } from "vitest";
import { h } from "vue";

describe("Field", () => {
	it("Nested Field", async ({ expect }) => {
		const formData = {
			user: {
				username: "",
				cardNumbers: ["123"],
			},
		};
		type FormData = typeof formData;

		const InnerFieldData = {
			setup() {
				const field = useInjectField<FormData["user"], FormData>();
				const usernameField = field.useField({ name: "username" });
				const usernameData = usernameField.useFieldData();

				const cardNumbersField = field.useFieldArray({ name: "cardNumbers" });
				const cardNumbersFieldData = cardNumbersField.useFieldData();

				return () => {
					return [
						h(
							"div",
							{
								"data-testid": "usernameData",
							},
							{
								default: () => JSON.stringify(usernameData.value),
							}
						),
						h(
							"div",
							{
								"data-testid": "cardNumbersData",
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
			setup() {
				const field = useInjectField<FormData["user"], FormData>();
				const cardNumbersField = field.useFieldArray({ name: "cardNumbers" });

				return () => {
					return [
						h(
							field.Field,
							{ name: "username" },
							{
								default: () =>
									h(EzBindingFieldInput, null, {
										default: () => [
											h("input", { "data-testid": "usernameInput" }),
										],
									}),
							}
						),
						h(
							field.FieldArray,
							{ name: "cardNumbers" },
							{
								default: ({ fieldsInfo }: { fieldsInfo: unknown[] }) =>
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
																	"data-testid": `cardNumberInput[${index}]`,
																}),
															],
														}),
													],
												}
											);
										})
									),
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
								form.Field,
								{
									name: "user",
								},
								{
									default: () => [h(InnerField), h(InnerFieldData)],
								}
							),
						],
					});
				};
			},
		});

		const usernameInput = screen.getByTestId("usernameInput");
		expect(usernameInput).toBeInTheDocument();
		await userEvent.type(usernameInput, "johnson");

		const usernameDataEl = screen.getByTestId("usernameData");
		const usernameData = usernameDataEl.innerHTML;
		expect(usernameData).toMatch('"value":"johnson"');

		const cardNumberInput = screen.getByTestId("cardNumberInput[0]");
		expect(cardNumberInput).toBeInTheDocument();
		expect(cardNumberInput).toHaveValue("123");
		await userEvent.type(cardNumberInput, "456");

		const cardNumbersDataEl = screen.getByTestId("cardNumbersData");
		const cardNumbersData = cardNumbersDataEl.innerHTML;
		expect(cardNumbersData).toMatch('"value":["123456"]');
	});
});
