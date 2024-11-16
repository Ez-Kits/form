import {
	FieldErrors,
	registerGlobalValidator,
	useFieldContext,
	useForm,
} from "@ez-kits/form-solid";
import { createUniqueId, Index, type Component } from "solid-js";

import { zodValidator } from "@ez-kits/form-zod-validator";
import { z } from "zod";
import styles from "./App.module.css";
import logo from "./logo.svg";

const App: Component = () => {
	return (
		<div class={styles.App}>
			<header class={styles.header}>
				<img src={logo} class={styles.logo} alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
					class={styles.link}
					href="https://github.com/solidjs/solid"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn Solid
				</a>
				<LoginPage />
			</header>
		</div>
	);
};

export default App;

interface LoginForm {
	user: { username: string; password: string; addresses: { city: string }[] };
}

declare module "@ez-kits/form-solid" {
	interface GlobalRegister {
		validator: typeof zodValidator;
	}
}

registerGlobalValidator(zodValidator);

function LoginPage() {
	const form = useForm<LoginForm>({
		initialValues: {
			user: {
				username: "",
				password: "",
				addresses: [],
			},
		},
		validationSchema: z.object({
			username: z.string().min(1, "This field is required"),
			password: z.string().min(1, "This field is required"),
			addresses: z.array(
				z.object({
					city: z.string().min(1, "This field is required"),
				})
			),
		}),
	});

	form.on("error", (errors) => {
		console.log(errors);
	});

	return (
		<form.Form>
			<form.Observe>
				{({ values }) => <span>{JSON.stringify(values())}</span>}
			</form.Observe>
			<form {...form.getFormProps()}>
				<form.Field name="user">
					<InnerFieldData />
				</form.Field>
				<form.Field name="user.username">
					{({ field }) => (
						<>
							<input data-testid="usernameInput" {...field.getInputProps()} />
						</>
					)}
				</form.Field>

				<form.Field name="user.password">
					{({ field }) => (
						<input
							data-testid="passwordInput"
							type="password"
							{...field.getInputProps()}
						/>
					)}
				</form.Field>
				<form.FieldArray name="user.addresses">
					{({ fieldArray, fieldsInfo }) => (
						<div>
							<div>
								<Index each={fieldsInfo()}>
									{(_, index) => (
										<fieldArray.Field index={index} name="city">
											{({ field }) => (
												<div>
													<input {...field.getInputProps()} type="text" />
													<FieldErrors>
														{(errors) => (
															<div>
																{errors()
																	.flatMap((error) => error.messages)
																	.join(", ")}
															</div>
														)}
													</FieldErrors>
												</div>
											)}
										</fieldArray.Field>
									)}
								</Index>
							</div>
							<div>
								<button
									onClick={() => fieldArray.push({ city: createUniqueId() })}
								>
									Push
								</button>
								<button onClick={() => fieldArray.swap(0, 1)}>Swap</button>
							</div>
						</div>
					)}
				</form.FieldArray>
			</form>
		</form.Form>
	);
}

function InnerFieldData() {
	const field = useFieldContext<LoginForm["user"], FormData>();
	const fieldData = field.useFieldData();

	return <div data-testid="fieldData">{JSON.stringify(fieldData())}</div>;
}
