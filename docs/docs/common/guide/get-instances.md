---
title: Get Instances
---

# Get Instances

These utilities will help you get `FormInstance`, `FieldInstance` or `FieldArrayInstance` from anywhere in your app.

::: warning

Instance that these utilities return only **exits after Form mount**.
If you use these utilities before form mount, they will return `undefined`.

:::

## getFormInstance()

Function to get `FormInstance` by name. You have to name your form before use this function.

## getFieldInstance()

Function to get `FormItemInstance` by _form's name_ and _field's name path_.

## getFieldArrayInstance()

Function to get `FieldArrayInstance` by _form's name_ and _field array's name path_.
