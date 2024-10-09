<!-- A part of page Basic Form for Vue -->

::: sandbox {template=vite-vue-ts deps=@ez-kits/form-vue:latest,@ez-kits/form-zod-validator:latest,zod:latest hideEditor}
<<< @/../docs/snippets/validation/vue.snippet#display-errors{vue} [src/SignInForm.vue]

```vue src/App.vue
<script setup lang="ts">
import SignInForm from "./SignInForm.vue";
</script>

<template>
	<SignInForm />
</template>
```
:::