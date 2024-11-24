import { useForm } from "@ez-kits/form-solid";
import { Index } from "solid-js";
export interface Member {
	fullName: string;
	age: number;
}

export interface MembersFormValues {
	members: Member[];
}

export function MembersForm() {
	const membersForm = useForm<MembersFormValues>({
		initialValues: {
			members: [
				{
					fullName: "Test member",
					age: 18,
				},
			],
		},
	});

	return (
		<membersForm.Form>
			<form {...membersForm.getFormProps()}>
				<membersForm.FieldArray name="members">
					{({ fieldArray, fieldsInfo }) => {
						return (
							<div>
								<Index each={fieldsInfo()}>
									{(_, index) => (
										<div>
											Member {index + 1}:
											<div>
												<fieldArray.Field name={`[${index}].fullName`}>
													{({ field, value }) => (
														<label>
															Full name:
															<input
																value={value()}
																{...field.getInputHandlers()}
															/>
														</label>
													)}
												</fieldArray.Field>
												<fieldArray.Field name={`[${index}].age`}>
													{({ field, value }) => (
														<label>
															Age:
															<input
																value={value()}
																{...field.getInputHandlers()}
																type="number"
															/>
														</label>
													)}
												</fieldArray.Field>
											</div>
											<button onClick={() => fieldArray.remove(index)}>
												Remove member {index + 1}
											</button>
										</div>
									)}
								</Index>

								<button
									onClick={() =>
										fieldArray.push({
											fullName: "",
											age: 18,
										})
									}
								>
									Add member
								</button>
							</div>
						);
					}}
				</membersForm.FieldArray>
			</form>
		</membersForm.Form>
	);
}
