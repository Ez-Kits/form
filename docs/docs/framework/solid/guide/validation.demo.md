<!-- A part of page Basic Form for Solid -->

::: sandbox {template=vite-solid deps=@ez-kits/form-solid:latest,@ez-kits/form-zod-validator:latest,zod:latest hideEditor}
<<< @/../docs/snippets/validation/solid.snippet#display-errors{tsx} [SignInForm.tsx]

```tsx App.tsx
import { SignInForm } from "./SignInForm";

export default function App() {
	return <SignInForm />;
}
```
:::