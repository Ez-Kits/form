<script lang="ts" setup>
import { EzBindingFieldInput, useInjectFieldArray } from "@ez-kits/form-vue";
import { Member, MembersFormValues } from "./MembersForm.vue";

defineProps<{
	index: number;
}>();

const fieldArray = useInjectFieldArray<Member[], MembersFormValues>();
</script>

<template>
	<div>
		<fieldArray.Field :name="`[${index}].fullName`">
			<label>
				Full name:
				<EzBindingFieldInput>
					<input />
				</EzBindingFieldInput>
			</label>
		</fieldArray.Field>
		<fieldArray.Field :name="`[${index}].age`">
			<label>
				Age:
				<EzBindingFieldInput>
					<input type="number" />
				</EzBindingFieldInput>
			</label>
		</fieldArray.Field>
	</div>
</template>
