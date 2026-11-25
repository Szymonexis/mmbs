type Fields<T> = {
	[K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};

function same(a: unknown, b: unknown): boolean {
	if (a instanceof Data) return a.equals(b);
	if (Array.isArray(a)) {
		return Array.isArray(b) && a.length === b.length && a.every((x, i) => same(x, b[i]));
	}
	return Object.is(a, b);
}

export abstract class Data {
	static create<T extends Data>(this: new () => T, init: Partial<Fields<T>> = {}): T {
		const instance = new this();
		for (const [key, value] of Object.entries(init)) {
			if (value !== undefined) (instance as any)[key] = value; // undefined = keep the default
		}
		return Object.freeze(instance);
	}

	copy(changes: Partial<Fields<this>> = {}): this {
		return (this.constructor as any).create({ ...this, ...changes });
	}

	equals(other: unknown): boolean {
		if (this === other) return true;
		if (!(other instanceof Data) || other.constructor !== this.constructor) return false;
		const a = this as any;
		const b = other as any;
		return Object.keys(a).every((k) => same(a[k], b[k]));
	}

	hashKey(): string {
		return JSON.stringify(Object.values(this));
	}

	toString(): string {
		const fields = Object.entries(this)
			.map(([k, v]) => `${k}=${Array.isArray(v) ? `[${v}]` : v}`)
			.join(', ');
		return `${this.constructor.name}(${fields})`;
	}
}
