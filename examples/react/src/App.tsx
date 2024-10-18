import {
	BindingFieldInput,
	FieldErrors,
	registerGlobalValidator,
	useFieldContext,
	useForm,
} from "@ez-kits/form-react";
import { zodValidator } from "@ez-kits/form-zod-validator";
import { useState } from "react";
import { z } from "zod";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
			{count % 2 === 0 && <LoginPage />}
		</>
	);
}

export default App;

interface LoginForm {
	username: string;
	password: string;
	addresses: {
		lineOne: string;
		lineTwo: string;
	}[];
	job: {
		position: string;
		salary: number;
	};
}

declare module "@ez-kits/form-react" {
	interface GlobalRegister {
		validator: typeof zodValidator;
	}
}

registerGlobalValidator(zodValidator);

function LoginPage() {
	const form = useForm<LoginForm>({
		name: "abc",
	});

	return (
		<form.Form>
			<form {...form.getFormProps()}>
				<form.Observe>
					{({ values }) => <span>{JSON.stringify(values)}</span>}
				</form.Observe>
				<form.ObserveField name="addresses">
					{({ value: addresses }) => <span>{addresses?.join(",")}</span>}
				</form.ObserveField>
				<br />
				<form.Field
					name="username"
					validationSchema={() => {
						return new Promise((resolve) => {
							setTimeout(() => {
								resolve({
									onChange: z
										.string()
										.min(1, "Username is required")
										.default(""),
									onBlur: z
										.string()
										.min(6, "Username must be at least 6 characters")
										.default(""),
								});
							}, 1000);
						});
					}}
				>
					<BindingFieldInput>
						<input
							data-testid="usernameInput"
							autoComplete="off"
							autoCorrect="off"
						/>
					</BindingFieldInput>
					<br />
					<FieldErrors>
						{(errors) => errors?.map((error) => error.messages)}
					</FieldErrors>
					<br />
					<FieldMeta />
				</form.Field>
				<br />
				<form.Field name="password" label="Password">
					<BindingFieldInput>
						<input data-testid="passwordInput" type="password" />
					</BindingFieldInput>
					<FieldErrors>
						{(errors) => errors?.map((error) => error.messages)}
					</FieldErrors>
				</form.Field>

				<br />

				<form.FieldArray name="addresses">
					{({ fieldArray, fieldsInfo }) => {
						return (
							<>
								{fieldsInfo.map((field) => {
									return (
										<div key={field.key}>
											<fieldArray.Field index={field.index} name="lineOne">
												<BindingFieldInput>
													<input />
												</BindingFieldInput>

												<FieldErrors>
													{(errors) => errors?.map((error) => error.messages)}
												</FieldErrors>
											</fieldArray.Field>
											<br />
											<fieldArray.Field
												index={field.index}
												name="lineTwo"
												label="Line two"
											>
												<BindingFieldInput>
													<input />
												</BindingFieldInput>

												<FieldErrors>
													{(errors) => errors?.map((error) => error.messages)}
												</FieldErrors>
											</fieldArray.Field>
										</div>
									);
								})}
								<br />
								<button
									onClick={() =>
										fieldArray.push({
											lineOne: "abc",
											lineTwo: "def",
										})
									}
								>
									Add new
								</button>
								<button
									onClick={() =>
										fieldArray.insert(2, {
											lineOne: "def",
											lineTwo: "asdfasdf",
										})
									}
								>
									Insert
								</button>
								<button onClick={() => fieldArray.pop()}>Pop</button>
								<button onClick={() => fieldArray.swap(0, 1)}>Swap</button>
							</>
						);
					}}
				</form.FieldArray>
			</form>
		</form.Form>
	);
}

function FieldMeta() {
	const field = useFieldContext();
	const fieldMeta = field.useFieldMeta();

	return (
		<div>
			<button
				type="button"
				onClick={() => field.validate({ trigger: "change" })}
			>
				Validate
			</button>
			<pre>
				<code>{JSON.stringify(fieldMeta, null, 2)}</code>
			</pre>
		</div>
	);
}
