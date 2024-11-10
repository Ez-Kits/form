<script lang="ts" setup>
defineProps<{ value?: string }>();
const emit = defineEmits<{ (e: "update:value", value: string): void }>();

function updateValue(event: Event) {
	if (event.target instanceof HTMLInputElement) {
		emit("update:value", event.target.value);
	}
}
</script>
<template>
	<input :value="value" @input="updateValue" />
</template>
