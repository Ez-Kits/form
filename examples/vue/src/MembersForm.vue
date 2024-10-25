<script lang="ts" setup>
import { useForm } from "@ez-kits/form-vue";
import MemberItem from "./MemberItem.vue";

export interface Member {
	fullName: string;
	age: number;
}

export interface MembersFormValues {
	members: Member[];
}

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
</script>

<template>
	<membersForm.Form>
		<form v-bind="membersForm.getFormProps()">
			<membersForm.FieldArray
				name="members"
				v-slot="{ fieldArray, fieldsInfo }"
			>
				<div>
					<div v-for="(_, index) in fieldsInfo">
						Member {{ index + 1 }}:
						<MemberItem :index="index" />
						<button @click="fieldArray.remove(index)">
							Remove member {{ index + 1 }}
						</button>
					</div>

					<button
						@click="
							fieldArray.push({
								fullName: '',
								age: 18,
							})
						"
					>
						Add member
					</button>
				</div>
			</membersForm.FieldArray>
		</form>
	</membersForm.Form>
</template>
