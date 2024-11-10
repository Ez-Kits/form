<script lang="ts" setup>
import { useForm } from "@ez-kits/form-vue";
import { useVirtualizer } from "@tanstack/vue-virtual";
import { computed, ref, watchEffect } from "vue";
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
		members: Array(10000)
			.fill(0)
			.map((_, index) => {
				return {
					fullName: `Test member ${index + 1}`,
					age: 18,
				};
			}),
	},
});
const membersField = membersForm.useFieldArray({
	name: "members",
});
const data = membersField.useFieldData();

watchEffect(() => {
	console.log(data.value);
});

const parentRef = ref<HTMLElement | null>(null);

const rowVirtualizer = useVirtualizer({
	count: data.value.value.length,
	getScrollElement: () => parentRef.value,
	estimateSize: () => 55,
});

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems());

const totalSize = computed(() => rowVirtualizer.value.getTotalSize());

const measureElement = (el: HTMLElement) => {
	if (!el) {
		return;
	}

	rowVirtualizer.value.measureElement(el);

	return undefined;
};
</script>

<template>
	<membersForm.Form>
		<form v-bind="membersForm.getFormProps()">
			<membersForm.FieldArray name="members" v-slot="{ fieldArray }">
				<div
					ref="parentRef"
					class="List"
					style="height: 400px; width: 400px; overflow-y: auto; contain: strict"
				>
					<div
						:style="{
							height: `${totalSize}px`,
							width: '100%',
							position: 'relative',
						}"
					>
						<div
							:style="{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								transform: `translateY(${virtualRows[0]?.start ?? 0}px)`,
							}"
						>
							<div
								v-for="virtualRow in virtualRows"
								:key="virtualRow.key.toString()"
								:data-index="virtualRow.index"
								:ref="measureElement"
								:class="virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'"
							>
								<div style="padding: 10px 0">
									Member {{ virtualRow.index + 1 }}:
									<MemberItem :index="virtualRow.index" />
									<button @click="fieldArray.remove(virtualRow.index)">
										Remove member {{ virtualRow.index + 1 }}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</membersForm.FieldArray>
		</form>
	</membersForm.Form>
</template>
