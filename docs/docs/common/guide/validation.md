---
title: Validation
---

# Validation

**Ez Form** has a built-in validation system to handle form validation. It is not dependent on specific libraries and very easy to customize.

- You can add validation schema at field level or form level or both.
- Create your own validator.
- Decide when to trigger validation (submit, change, blur).

**Ez Form** comes with a set of built-in validators. But, in this page, we will use ZodValidator.

:::tabs key:pm
== npm
```sh
npm i --save-dev @ez-kits/form-zod-validator zod
```
== yarn
```sh
yarn add -D @ez-kits/form-zod-validator zod
```
== pnpm
```sh
pnpm add -D @ez-kits/form-zod-validator zod
```
:::

## Field Level

You can pass your field's validation schema to **Field** using prop `validationSchema`.

You can pass a single schema or an array of schema. And decide when to trigger validate with that schema.

- `onChange`
- `onBlur`
- `onSubmit`

::if framework=react
<<< @/../docs/snippets/validation/react.snippet#field-level{tsx}
::elseif framework=vue
<<< @/../docs/snippets/validation/vue.snippet#field-level{vue}
::elseif framework=solid
<<< @/../docs/snippets/validation/solid.snippet#field-level{tsx}
::elseif framework=vanilla

::: code-group
<<< @/../docs/snippets/validation/vanilla.snippet#field-level{ts} [index.ts]
<<< @/../docs/snippets/validation/vanilla.snippet#html{html} [index.html]
:::

::endif

## Form Level

You can also pass your form's validation schema to **Form** using prop `validationSchema`. Like `Field`, you can also pass a single schema or an array of schema. And decide when to trigger validate with that schema.

- `onChange`
- `onBlur`
- `onSubmit`

::if framework=react
<<< @/../docs/snippets/validation/react.snippet#form-level{tsx}
::elseif framework=vue
<<< @/../docs/snippets/validation/vue.snippet#form-level{vue}
::elseif framework=solid
<<< @/../docs/snippets/validation/solid.snippet#form-level{tsx}
::elseif framework=vanilla

::: code-group
<<< @/../docs/snippets/validation/vanilla.snippet#form-level{ts} [index.ts]
<<< @/../docs/snippets/validation/vanilla.snippet#html{html} [index.html]
:::

::endif


## Display Error

::if framework=vanilla

Validation errors retrieved from **Field** or **Form** will be synchronously, you can retrieve them using `field.meta.errors` or `form.meta.errors`.

You can listen to event `change:meta` on `FieldInstance` or `FormInstance` to retrieve new validation errors and update UI.

::else

Validation errors in `FormInstance` or `FieldInstance` will be synchronously. **Ez Form** provides component `FieldErrors` to display validation errors.

::endif

::if framework=react
<<< @/../docs/snippets/validation/react.snippet#display-errors{tsx}
::elseif framework=vue
<<< @/../docs/snippets/validation/vue.snippet#display-errors{vue}
::elseif framework=solid
<<< @/../docs/snippets/validation/solid.snippet#display-errors{tsx}
::elseif framework=vanilla

::: code-group
<<< @/../docs/snippets/validation/vanilla.snippet#display-errors{ts} [index.ts]
<<< @/../docs/snippets/validation/vanilla.snippet#html{html} [index.html]
:::

::endif

## Demo

::if framework=react
<!--@include: @/../docs/framework/react/guide/validation.demo.md-->
::elseif framework=vue
<!--@include: @/../docs/framework/vue/guide/validation.demo.md-->
::elseif framework=solid
<!--@include: @/../docs/framework/solid/guide/validation.demo.md-->
::elseif framework=vanilla
<!--@include: @/../docs/framework/vanilla/guide/validation.demo.md-->
::endif