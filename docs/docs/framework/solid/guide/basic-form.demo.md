<!-- A part of page Basic Form for Solid -->

::: sandbox {template=vite-solid deps=@ez-kits/form-solid:latest hideEditor}
<<< @/../docs/snippets/basic-form/solid.snippet#submission{tsx} [SignInForm.tsx]

```tsx App.tsx
import { SignInForm } from "./SignInForm";

export default function App() {
	return <SignInForm />;
}
```
:::