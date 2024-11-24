import { BindingFieldInput, useForm } from "@ez-kits/form-react";

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
					{({ fieldsInfo, fieldArray }) => {
						return (
							<div>
								{fieldsInfo.map((fieldInfo, index) => {
									return (
										<div key={fieldInfo.key}>
											Member {index + 1}:
											<div>
												<fieldArray.Field name={`[${index}].fullName`}>
													<label>
														Full name:
														<BindingFieldInput>
															<input />
														</BindingFieldInput>
													</label>
												</fieldArray.Field>
												<fieldArray.Field name={`[${index}].age`}>
													<label>
														Age:
														<BindingFieldInput>
															<input type="number" />
														</BindingFieldInput>
													</label>
												</fieldArray.Field>
											</div>
											<button onClick={() => fieldArray.remove(index)}>
												Remove member {index + 1}
											</button>
										</div>
									);
								})}

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
