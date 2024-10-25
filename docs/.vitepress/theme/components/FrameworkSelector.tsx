/* @jsxImportSource vue */
import { useData, useRouter } from "vitepress";
import {
	computed,
	defineComponent,
	onBeforeUnmount,
	onMounted,
	ref,
	useTemplateRef,
} from "vue";
import { defaultFramework, frameworks } from "../configs/frameworks";
import { vitepressBaseUrl } from "../configs/url";

export default defineComponent({
	setup() {
		// Handle open dropdown
		const isDropdownOpen = ref(false);
		const toggleDropdown = () => {
			isDropdownOpen.value = !isDropdownOpen.value;
		};

		// Handle selected framework
		const data = useData();
		const router = useRouter();
		const selectedFrameworkId = computed(
			() => data.params.value?.framework || defaultFramework.id
		);

		const selectedFramework = computed(() =>
			frameworks.find((f) => f.id === selectedFrameworkId.value)
		);

		const label = computed(() => {
			if (selectedFramework.value) {
				return selectedFramework.value.name;
			}

			return "Select a framework";
		});

		const selectFramework = (id: string) => {
			const targetPath = router.route.path.replace(
				new RegExp(`^${vitepressBaseUrl}(.*?)/`),
				`${vitepressBaseUrl}${id}/`
			);
			router.go(targetPath);
			isDropdownOpen.value = false;
		};

		// Template ref
		const frameworksSelectorRef =
			useTemplateRef<HTMLDivElement>("frameworksSelector");

		const handleDocumentClick = (e: MouseEvent) => {
			if (!frameworksSelectorRef.value) {
				return;
			}

			if (
				frameworksSelectorRef.value !== e.target &&
				!frameworksSelectorRef.value.contains(e.target as Node)
			) {
				isDropdownOpen.value = false;
			}
		};

		onMounted(() => {
			document.addEventListener("click", handleDocumentClick);
		});

		onBeforeUnmount(() => {
			document.removeEventListener("click", handleDocumentClick);
		});

		return () => (
			<div class="frameworks-selector" ref="frameworksSelector">
				<div class="frameworks-selector__trigger" onClick={toggleDropdown}>
					{selectedFramework.value && (
						<img src={selectedFramework.value.logo} />
					)}
					{label.value}
				</div>
				<div
					class={`frameworks-selector__dropdown ${
						isDropdownOpen.value ? "open" : "close"
					}`}
				>
					{frameworks.map((f) => (
						<div
							key={f.id}
							class="frameworks-selector__dropdown-item"
							onClick={() => selectFramework(f.id)}
						>
							<img src={f.logo} />
							{f.name}
						</div>
					))}
				</div>
			</div>
		);
	},
});
