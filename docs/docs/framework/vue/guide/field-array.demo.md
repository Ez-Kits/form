<!-- A part of page Basic Form for Vue -->

::: sandbox {template=vite-vue-ts deps=@ez-kits/form-vue:latest hideEditor}
<<< @/../docs/snippets/field-array/vue.snippet#form{vue} [src/MembersForm.vue]
<<< @/../docs/snippets/field-array/vue.snippet#field-item{vue} [src/Member.vue]

```vue src/App.vue
<script setup lang="ts">
import MembersForm from "./MembersForm.vue";
</script>

<template>
	<MembersForm />
</template>
```
:::