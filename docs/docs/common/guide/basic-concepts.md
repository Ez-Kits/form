---
title: Basic Concepts
---

# Basic Concepts

This page will introduce some basic concepts in **Ez Form**.

## Form Instance

`FormInstance` is an object that contains the form's data and methods.

::if framework=vanilla
You can get it from `createForm`.
::else
You can get it from `useForm`.
::endif

::if framework=react
<<< @/../docs/snippets/basic-concepts/react.snippet#form-instance{tsx}
::elseif framework=vue
<<< @/../docs/snippets/basic-concepts/vue.snippet#form-instance{tsx}
::elseif framework=solid
<<< @/../docs/snippets/basic-concepts/solid.snippet#form-instance{tsx}
::elseif framework=vanilla
<<< @/../docs/snippets/basic-concepts/vanilla.snippet#form-instance{tsx}
::endif

## Field Instance

`FieldInstance` is an object that contains the field's data and methods. This is the way to get it.

::if framework=react
<<< @/../docs/snippets/basic-concepts/react.snippet#field-instance{tsx}
::elseif framework=vue
<<< @/../docs/snippets/basic-concepts/vue.snippet#field-instance{tsx}
::elseif framework=solid
<<< @/../docs/snippets/basic-concepts/solid.snippet#field-instance{tsx}
::elseif framework=vanilla
<<< @/../docs/snippets/basic-concepts/vanilla.snippet#field-instance{tsx}
::endif

::if framework=vanilla
::elseif framework=vue
::: warning
`useField` injects `FormInstance`, provided by `useForm`. So, you have to use `useField` in component under `form.Form` or `useForm`.
:::
::else
::: warning
`useField` uses `FormInstance`, provided by `form.Form`. So, you have to use `useField` in component under `form.Form` or `useForm`.
:::
::endif

## Field Array Instance

`FieldArrayInstance` is an object that contains the field array's data and methods. You can get it just like `FieldInstance`.

::if framework=react
<<< @/../docs/snippets/basic-concepts/react.snippet#field-array-instance{tsx}
::elseif framework=vue
<<< @/../docs/snippets/basic-concepts/vue.snippet#field-array-instance{tsx}
::elseif framework=solid
<<< @/../docs/snippets/basic-concepts/solid.snippet#field-array-instance{tsx}
::elseif framework=vanilla
<<< @/../docs/snippets/basic-concepts/vanilla.snippet#field-array-instance{tsx}
::endif

::if framework=vanilla
::elseif framework=vue
::: warning
`useFieldArray` injects `FormInstance`, provided by `useForm`. So, you have to use `useFieldArray` in component under `form.Form` or `useForm`.
:::
::else
::: warning
`useFieldArray` uses `FormInstance`, provided by `form.Form`. So, you have to use `useFieldArray` in component under `form.Form` or `useForm`.
:::
::endif
