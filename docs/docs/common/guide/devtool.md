---
title: Ez Form Devtool
---
# Devtool

::if framework=vue

**Ez Form** comes with a Vue Devtool Plugin designed to make form inspection easier. Your development experience (DX) with **Ez Form** is now better than ever!

### Introduction

Devtool provides a form tree that displays the main state of your forms. It also includes several actions to help you interact with your forms more effectively:

- Submit Form
- Reset Form
- Validate Form
- Clear Form Validation



![](../public/devtool.gif)

<style>
	.main img {
		width: 100%
	}
</style>

Each node in the form tree offers three additional actions:

- Reset
- Validate
- Clear validate

### Setup

Install package:

:::tabs key:pm
== npm
```sh
npm i --save-dev @ez-kits/form-vue-devtools-old
```
== yarn
```sh
yarn add -D @ez-kits/form-vue-devtools-old
```
== pnpm
```sh
pnpm add -D @ez-kits/form-vue-devtools-old
```
:::


Then, add plugin `EzFormDevtool` to your Vue app.

```ts
import { EzFormDevtool } from "@ez-kits/form-vue-devtools-old";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).use(EzFormDevtool).mount("#app");
```

::else

Currently, the **Ez Form** Devtool is only compatible with Vue, but support for additional frameworks is planned for the future.

::endif