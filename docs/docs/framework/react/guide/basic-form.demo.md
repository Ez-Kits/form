<!-- A part of page Basic Form for React -->

::: sandbox {template=vite-react-ts deps=@ez-kits/form-react:latest hideEditor}
<<< @/../docs/snippets/basic-form/react.snippet#submission{tsx} [SignInForm.tsx]

```tsx App.tsx
import { SignInForm } from "./SignInForm";

export default function App() {
	return <SignInForm />;
}
```
:::