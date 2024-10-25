---
title: Field Array
---

# Field Array

In this page, you will learn how to create a `FieldArrayInstance` and handle array of data by using **Ez Form**.

## Create Field

::if framework=vanilla
To create `FieldArrayInstance`, you can use `form.createFieldArray`. Let's me show you how to do it in real life:
::else
To create `FieldArrayInstance`, you can use `useFieldArray` or `form.FieldArray`. Let's me show you how to do it in real life:
::endif

::if framework=react
<<< @/../docs/snippets/field-array/react.snippet{tsx}
::elseif framework=vue
::: code-group
<<< @/../docs/snippets/field-array/vue.snippet#form{vue} [MembersForm.vue]
<<< @/../docs/snippets/field-array/vue.snippet#field-item{vue} [Member.vue]
:::
::elseif framework=solid
<<< @/../docs/snippets/field-array/solid.snippet{tsx}
::elseif framework=vanilla

::: code-group
<<< @/../docs/snippets/field-array/vanilla.snippet#form{ts} [index.ts]
<<< @/../docs/snippets/field-array/vanilla.snippet#html{html} [index.html]
:::

::endif

## Utilities

`FieldArrayInstance` provides these utilities to let you handle array of data easier:

- `push`
- `unshift`
- `pop`
- `shift`
- `insert`
- `remove`
- `swap`
- `move`
- `replace`

## Demo

::if framework=react
<!--@include: @/../docs/framework/react/guide/field-array.demo.md-->
::elseif framework=vue
<!--@include: @/../docs/framework/vue/guide/field-array.demo.md-->
::elseif framework=solid
<!--@include: @/../docs/framework/solid/guide/field-array.demo.md-->
::elseif framework=vanilla
<!--@include: @/../docs/framework/vanilla/guide/field-array.demo.md-->
::endif
