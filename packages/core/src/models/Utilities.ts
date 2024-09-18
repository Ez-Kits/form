export type GetType<T, K extends string> = K extends keyof T
	? T[K]
	: K extends `${infer A}.${infer B}`
	? A extends keyof T
		? GetType<T[A], B>
		: T extends (infer R)[]
		? GetType<R, K>
		: never
	: T extends (infer R)[]
	? GetType<R, K>
	: never;

// type JoinKey<A extends string, B extends string> = `${A extends ""
// 	? ""
// 	: `${A}.`}${B}`;
type OmitArrayProps<T> = T extends any[] ? Omit<T, keyof any[]> : T;

// type GetKeysImpl<T, P extends string = "", K = keyof T> = K extends keyof T
// 	? T[K] extends any[]
// 		? JoinKey<P, K & string>
// 		: T[K] extends object
// 		?
// 				| JoinKey<P, K & string>
// 				| GetKeysImpl<OmitArrayProps<T[K]>, JoinKey<P, K & string>>
// 		: JoinKey<P, K & string>
// 	: never;

export type GetKeysInner<T> = T extends object
	? {
			[K in keyof OmitArrayProps<T>]: K extends string
				? OmitArrayProps<T>[K] extends object
					? `${K}` | `${K}.${GetKeysInner<OmitArrayProps<T>[K]>}`
					: `${K}`
				: never;
	  }[keyof OmitArrayProps<T>]
	: never;

export type GetKeys<T> = T extends (infer E)[]
	? GetKeysInner<E>
	: GetKeysInner<T>;

export type ToArray<T> = T extends any[] ? T : T[];
