import type { NamePath } from "src/models";

export function clone<T>(input: T): T {
	if (typeof input !== "object" || input === null) {
		return input;
	}

	const output: any = Array.isArray(input) ? ([] as any[]) : {};

	for (const key in input) {
		const value = input[key];
		output[key] = clone(value);
	}

	return output;
}

export function castPath(path: NamePath): string[] {
	if (Array.isArray(path)) {
		return path.reduce<string[]>((result, p) => {
			return result.concat(castPath(p));
		}, []);
	}

	if (typeof path === "string") {
		return path.replace(/\[([\d\w]+)\]/g, "$1").split(".");
	}

	return [String(path)];
}

export function isPathStartsWith(input: NamePath, path: NamePath) {
	const keys = castPath(path);
	const inputKeys = castPath(input);

	return keys.every((key, index) => key === inputKeys[index]);
}

export function get(input: any, path: NamePath) {
	const keys = castPath(path);

	let index = 0;

	for (; index < keys.length && input != null; index++) {
		const key = keys[index];
		if (key !== undefined) {
			input = input[key];
		}
	}

	const result = index && index === keys.length ? input : undefined;

	return result;
}

export function set(
	input: any,
	path: NamePath,
	value: any,
	generateValue?: (
		input: any,
		key: string,
		keyIndex: number,
		keys: string[]
	) => any
) {
	const keys = castPath(path);

	let index = 0;

	for (; index < keys.length && input != null; index++) {
		let newValue = value;
		const key = keys[index];
		if (key === undefined) {
			continue;
		}

		if (index !== keys.length - 1) {
			const inputValue = input[key];
			newValue = generateValue
				? generateValue(input, key, index, keys)
				: undefined;
			if (newValue === undefined) {
				newValue =
					typeof inputValue === "object"
						? inputValue
						: !Number.isNaN(Number(keys[index + 1]))
						? []
						: {};
			}
		}
		input[key] = newValue;
		input = input[key];
	}
}

// export function deleteFrom(input: any, path: NamePath) {
// 	const keys = castPath(path);
// 	input = get(input, keys.slice(0, -1));

// 	if (input) {
// 		const key = keys.pop();
// 		key && delete input[key];
// 	}
// }

export function mapValues<T extends object, R>(
	input: T,
	cb: <K extends keyof T>(value: T[K], key: K, obj: T) => R
): Record<keyof T, R> {
	const keys = Object.keys(input);

	return keys.reduce<Record<keyof T, R>>((result, key) => {
		result[key as keyof T] = cb(input[key as keyof T], key as keyof T, input);

		return result;
	}, {} as any);
}
