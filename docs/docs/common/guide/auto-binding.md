---
title: Auto Binding
---

# Auto Binding

::if framework=solid
_Auto binding_ is currently not supported for Solid.
::else
In this page, we will explain how auto binding works in **Ez Form**.
::endif

::if framework=vue

## Updating data

**Ez Form** use `v-model:value` to sync data with your input. Normally, you usually use `v-model` to get data from input, so **Ez Form** do the same, but it is automatic.

If you want to get data from your custom input component, just make sure that your input component has two things bellow:

- Prop `value`: Form data will be pass to your input via this prop.
- Event `@update:value`: **Ez Form** will listen to this event to update data from your input.

In the other words, your input need provide a `v-model:value` to work with **Ez Form**.

## Blur event

By default, **Ez Form** will listen to event `@blur` to determine is input blur. So your component can emit `@blur` to be compatible with **Ez Form**.

::elseif framework=vanilla

## Updating data

**Ez Form** will query field input based on `name` prop. Then, listen to event `change` to update data and pass data to your input component via prop `value`. You can change these props name by updating these options:

- `valuePropName`: The name of `value` prop in your input.
- `changeEventName`: The name of `change` event in your input.

These options may useful when working with _checkbox_ or _radio_.

## Blur event

By default, **Ez Form** will listen to event `blur` to determine is input blur. You can change this event name by updating the following option:

- `blurEventName`: The name of `blur` event in your input.

::elseif framework=react

## Updating data

**Ez Form** use prop `value` and event `onChange` to sync data with your input. You usually use `value` to get data from input, so **Ez Form** do the same, but it is automatic.

If you want to get data from your custom input component, just make sure that your input component has two things bellow:

- Prop `value`: Form data will be pass to your input via this prop.
- Event `onChange`: **Ez Form** will listen to this event to update data from your input.

You can change these props name by updating these options:

- `valuePropName`: The name of `value` prop in your input.
- `changeEventName`: The name of `change` event in your input.

These options may useful when working with _checkbox_ or _radio_.

## Blur event

By default, **Ez Form** will listen to event `onBlur` to determine is input blur. So your component can emit `onBlur` to be compatible with **Ez Form**.

You can change this event name by updating the following option:

- `blurEventName`: The name of `blur` event in your input.

::endif
