---
title: Basic Form
---

# Basic Form

In this page, you will learn how to create a form by using **Ez Form**. We will start with a very popular form: **Sign In**.

::if framework=vanilla
<!--@include: @/../docs/framework/vanilla/guide/basic-form.prepare.md-->
::endif

## Create Form

Firstly, we need to add an interface for our form. A Sign In form should have the following properties:

::if framework=react
<<< @/../docs/snippets/basic-form/react.snippet#types{tsx}
::elseif framework=vue
<<< @/../docs/snippets/basic-form/vue.snippet#types{vue}
::elseif framework=solid
<<< @/../docs/snippets/basic-form/solid.snippet#types{tsx}
::elseif framework=vanilla
<<< @/../docs/snippets/basic-form/vanilla.snippet#types{ts}
::endif

::if framework=vanilla
Next, we need to create a form component. We can use `createForm` to create a form with the following properties:
::else
Next, we need to create a form component. We can use `useForm` to create a form with the following properties:
::endif

::if framework=react
<<< @/../docs/snippets/basic-form/react.snippet#form{tsx}
::elseif framework=vue
<<< @/../docs/snippets/basic-form/vue.snippet#form{vue}
::elseif framework=solid
<<< @/../docs/snippets/basic-form/solid.snippet#form{tsx}
::elseif framework=vanilla
<<< @/../docs/snippets/basic-form/vanilla.snippet#form{ts}
::endif

Now, our form is ready. Let's add fields to our form.

## Adding Fields

::if framework=vanilla
`FormInstance` includes method `createField`. We can use this method to add fields to our form.
::else
`FormInstance` includes a `Field` component. We can use this component to add fields to our form.
::endif


::if framework=react
<<< @/../docs/snippets/basic-form/react.snippet#fields{tsx}
::elseif framework=vue
<<< @/../docs/snippets/basic-form/vue.snippet#fields{vue}
::elseif framework=solid
<<< @/../docs/snippets/basic-form/solid.snippet#fields{tsx}
::elseif framework=vanilla
<<< @/../docs/snippets/basic-form/vanilla.snippet#fields{ts}
::endif

## Submitting the form

`FormInstance` includes a `submit` method. We can use this method to submit the form. Or you can use button type `submit` to submit the form.

To retrieve the form values after submitting, we can listen to the `onSubmit` event.

::if framework=react
<<< @/../docs/snippets/basic-form/react.snippet#submission{tsx}
::elseif framework=vue
<<< @/../docs/snippets/basic-form/vue.snippet#submission{vue}
::elseif framework=solid
<<< @/../docs/snippets/basic-form/solid.snippet#submission{tsx}
::elseif framework=vanilla
<<< @/../docs/snippets/basic-form/vanilla.snippet#submission{ts}
::endif

## Demo

This is final result. Fill in the form and submit. Then, the console will show the form values.

::if framework=react
<!--@include: @/../docs/framework/react/guide/basic-form.demo.md-->
::elseif framework=vue
<!--@include: @/../docs/framework/vue/guide/basic-form.demo.md-->
::elseif framework=solid
<!--@include: @/../docs/framework/solid/guide/basic-form.demo.md-->
::elseif framework=vanilla
<!--@include: @/../docs/framework/vanilla/guide/basic-form.demo.md-->
::endif