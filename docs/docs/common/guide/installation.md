---
title: Installation
---

# Installation

Setting up **Ez Form** is straightforward. Simply choose your preferred framework and install the corresponding package.

::if framework=react
<!--@include: @/../docs/framework/react/guide/installation.md-->
::elseif framework=vue
<!--@include: @/../docs/framework/vue/guide/installation.md-->
::elseif framework=solid
<!--@include: @/../docs/framework/solid/guide/installation.md-->
::elseif framework=vanilla
<!--@include: @/../docs/framework/vanilla/guide/installation.md-->
::endif

### Validators

**Ez Form** comes with a set of built-in validators. You can use them to validate your form.

:::tabs key:validators
== Zod
```sh
# npm
npm i @ez-kits/form-zod-validator zod
# yarn
yarn add @ez-kits/form-zod-validator zod
# pnpm
pnpm add -D @ez-kits/form-zod-validator zod
```
== Yup
```sh
# npm
npm i @ez-kits/form-yup-validator yup
# yarn
yarn add @ez-kits/form-yup-validator yup
# pnpm
pnpm add -D @ez-kits/form-yup-validator yup
```
== Valibot
```sh
# npm
npm i @ez-kits/form-valibot-validator valibot
# yarn
yarn add @ez-kits/form-valibot-validator valibot
# pnpm
pnpm add -D @ez-kits/form-valibot-validator valibot
```
== Async validator
```sh
# npm
npm i @ez-kits/form-async-validator async-validator
# yarn
yarn add @ez-kits/form-async-validator async-validator
# pnpm
pnpm add -D @ez-kits/form-async-validator async-validator
```
== Joi
```sh
# npm
npm i @ez-kits/form-joi-validator joi
# yarn
yarn add @ez-kits/form-joi-validator joi
# pnpm
pnpm add -D @ez-kits/form-joi-validator joi
```
:::
