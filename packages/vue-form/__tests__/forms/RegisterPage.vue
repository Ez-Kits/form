<template>
	<Form>
		<form v-bind="form.getFormProps()">
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
import type { FieldValidationSchema } from "@ez-kits/form-core";
import {
	EzBindingFieldInput,
	EzFieldErrors as FieldErrors,
	useForm,
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
	passwordValidationSchema?: FieldValidationSchema;
	confirmPasswordValidationSchema?: FieldValidationSchema;
}>();

const form = useForm<RegisterForm>({
	initialValues: props.initialValues,
});

const { Form, Field, ObserveField, Observe } = form;
</script>
