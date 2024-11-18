export type GetType<T, K extends string> = unknown extends T
	? T
	: T extends Record<string | number, any>
	? K extends `[${infer A}].${infer B}`
		? GetType<T[A], B>
		: K extends `[${infer A}]`
		? GetType<T, A>
		: K extends `${infer A}.${infer B}`
		? GetType<T[A], B>
		: K extends string
		? T[K]
		: never
	: never;

type OmitArrayProps<T> = T extends any[] ? Omit<T, keyof any[]> : T;

export type GetKeysInner<T> = T extends (infer I)[]
	? I extends object
		?
				| `${number}`
				| `${number}.${GetKeysInner<Required<I>>}`
				| `[${number}]`
				| `[${number}].${GetKeysInner<Required<I>>}`
		: `${number}` | `[${number}]`
	: T extends object
	? {
			[K in keyof OmitArrayProps<T>]: K extends string
				? OmitArrayProps<T>[K] extends object
					? `${K}` | `${K}.${GetKeysInner<Required<OmitArrayProps<T>[K]>>}`
					: `${K}`
				: string;
	  }[keyof OmitArrayProps<T>]
	: string;

export type GetKeys<T> = unknown extends T ? string : GetKeysInner<Required<T>>;

export type ToArray<T> = T extends any[] ? T : T[];
export type ToEvent<T extends string> = `on${Capitalize<T>}`;
