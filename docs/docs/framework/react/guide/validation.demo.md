<!-- A part of page Basic Form for React -->

::: sandbox {template=vite-react-ts deps=@ez-kits/form-react:latest,@ez-kits/form-zod-validator:latest,zod:latest hideEditor}
<<< @/../docs/snippets/validation/react.snippet#display-errors{tsx} [SignInForm.tsx]

```tsx App.tsx
import { SignInForm } from "./SignInForm";

export default function App() {
	return <SignInForm />;
}
```
:::