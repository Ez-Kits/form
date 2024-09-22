import { Ref, ref } from "vue";

export function useData<T>(value: T): Ref<T> {
	const data = ref(value) as Ref<T>;

	return data;
}
