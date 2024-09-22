<template>
	<Form>
		<form v-bind="registerForm.getFormProps()">
			<Field name="username">
				<EzBindingFieldInput>
					<input data-testid="usernameInput" />
				</EzBindingFieldInput>
			</Field>
			<Field name="password" :validationSchema="passwordValidationSchema">
				<EzBindingFieldInput>
					<input data-testid="passwordInput" type="password" />
				</EzBindingFieldInput>
				<FieldErrors v-slot="{ errors }">
					<span data-testid="passwordErrors">
						<template
							v-for="message in errors.flatMap(({ messages }) => messages)"
							>{{ message }}</template
						>
					</span>
				</FieldErrors>
			</Field>
			<Field
				name="confirmPassword"
				:validationSchema="confirmPasswordValidationSchema"
			>
				<EzBindingFieldInput>
					<input data-testid="confirmPasswordInput" type="password" />
				</EzBindingFieldInput>
				<FieldErrors v-slot="{ errors }">
					<span data-testid="confirmPasswordErrors">
						<template
							v-for="message in errors.flatMap(({ messages }) => messages)"
							>{{ message }}</template
						>
					</span>
				</FieldErrors>
			</Field>
			<Field name="address.lineOne">
				<EzBindingFieldInput>
					<input data-testid="addressLineOneInput" type="address" />
				</EzBindingFieldInput>
			</Field>
			<Field name="address.lineTwo">
				<EzBindingFieldInput>
					<input data-testid="addressLineTwoInput" type="address" />
				</EzBindingFieldInput>
			</Field>
			<ObserveField name="username" v-slot="{ value }">
				<span data-testid="observeUsername">{{ value }}</span>
			</ObserveField>
			<Observe v-slot="{ values }">
				<span data-testid="observeForm">{{ values }}</span>
			</Observe>
		</form>
	</Form>
</template>

<script lang="ts" setup>
import {
	EzBindingFieldInput,
	EzFieldErrors as FieldErrors,
	useForm,
	type DefaultValidationSchema,
} from "src/index";
export interface RegisterForm {
	username: string;
	password: string;
	confirmPassword: string;
	address: {
		lineOne: string;
		lineTwo: string;
	};
}

const props = defineProps<{
	initialValues?: RegisterForm;
	passwordValidationSchema?: DefaultValidationSchema;
	confirmPasswordValidationSchema?: DefaultValidationSchema;
}>();

const registerForm = useForm<RegisterForm>({
	initialValues: props.initialValues,
});

const { Form, Field, ObserveField, Observe } = registerForm;
</script>
