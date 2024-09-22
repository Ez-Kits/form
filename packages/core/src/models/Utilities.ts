export type GetType<T, K extends string> = K extends keyof T
	? T[K]
	: K extends `${infer A}.${infer B}`
	? A extends keyof T
		? GetType<T[A], B>
		: T extends (infer R)[]
		? A extends `${number}`
			? GetType<R, B>
			: never
		: never
	: T extends (infer R)[]
	? GetType<R, K>
	: never;

type OmitArrayProps<T> = T extends any[] ? Omit<T, keyof any[]> : T;

export type GetKeysInner<T> = T extends (infer I)[]
	? I extends object
		? `${number}` | `${number}.${GetKeysInner<I>}`
		: `${number}`
	: T extends object
	? {
			[K in keyof OmitArrayProps<T>]: K extends string
				? OmitArrayProps<T>[K] extends object
					? `${K}` | `${K}.${GetKeysInner<OmitArrayProps<T>[K]>}`
					: `${K}`
				: string;
	  }[keyof OmitArrayProps<T>]
	: string;

export type GetKeys<T> = T extends (infer E)[]
	? GetKeysInner<E>
	: GetKeysInner<T>;

export type ToArray<T> = T extends any[] ? T : T[];
export type ToEvent<T extends string> = `on${Capitalize<T>}`;
