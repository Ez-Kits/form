<!-- A part of page Basic Form for Vue -->

::: sandbox {template=vite-vue-ts deps=@ez-kits/form-vue:latest hideEditor}
<<< @/../docs/snippets/basic-form/vue.snippet#submission{vue} [src/SignInForm.vue]

```vue src/App.vue
<script setup lang="ts">
import SignInForm from "./SignInForm.vue";
</script>

<template>
	<SignInForm />
</template>
```
:::