/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import type {
	FieldInstance,
	FieldMeta,
	FormInstance,
} from "@ez-kits/form-core";
import type { DefaultValidationSchema } from "src/global";
import { useInjectField } from "src/provides/field";
import { useInjectForm } from "src/provides/form";
import { defineComponent, h, type Slot, type VNode } from "vue";

export type BindingFieldInputProps = {
	inputIndex?: number;
};

const BindingFieldInputImpl = defineComponent({
	name: "EzBindingFieldInput",
	props: {
		inputIndex: {
			type: Number,
			required: false,
			default: 0,
		},
	},
	setup(props, { slots }) {
		const form = useInjectForm();
		const field = useInjectField();
		const value = field.useFieldValue();
		const meta = field.useFieldMeta();

		const slotData = () => ({
			field,
			form,
			value: value.value,
			meta: meta.value,
		});

		const getVNodesFromDefaultSlot = () => {
			return slots.default ? getVNodeFromSlot(slots.default) : [];
		};

		const getVNodeFromSlot = (slot: Slot): VNode[] => {
			return slot(slotData());
		};

		return () =>
			getVNodesFromDefaultSlot().map((vNode, index) => {
				return h(
					vNode,
					{
						key: index,
						...(index === props.inputIndex ? field.getInputProps(vNode) : {}),
					},
					undefined
				);
			});
	},
});

type BaseBindingFieldInputType = typeof BindingFieldInputImpl;

const EzBindingFieldInput = BindingFieldInputImpl as unknown as Omit<
	BaseBindingFieldInputType,
	"$props"
> & {
	new (): {
		$props: BindingFieldInputProps;
		$slots: {
			default: (helpers: {
				field: FieldInstance<any, any, DefaultValidationSchema>;
				form: FormInstance<any, DefaultValidationSchema>;
				value: any;
				meta: FieldMeta;
			}) => any;
		};
	};
};

export default EzBindingFieldInput;
