import type { Hashable } from './hashable';

export class HashMap<K extends Hashable, V> implements Iterable<[K, V]> {
	private map = new Map<string | number, [K, V]>();

	constructor(entries?: Iterable<readonly [K, V]>) {
		if (entries) for (const [k, v] of entries) this.set(k, v);
	}

	set(key: K, value: V): this {
		const hash = key.hashKey();
		const existing = this.map.get(hash);
		if (existing) {
			existing[1] = value;
		} else {
			this.map.set(hash, [key, value]);
		}
		return this;
	}

	get(key: K): V | undefined {
		return this.map.get(key.hashKey())?.[1];
	}

	has(key: K): boolean {
		return this.map.has(key.hashKey());
	}

	delete(key: K): boolean {
		return this.map.delete(key.hashKey());
	}

	clear(): void {
		this.map.clear();
	}

	get size(): number {
		return this.map.size;
	}

	*keys(): IterableIterator<K> {
		for (const [k] of this.map.values()) yield k;
	}

	*values(): IterableIterator<V> {
		for (const [, v] of this.map.values()) yield v;
	}

	*entries(): IterableIterator<[K, V]> {
		for (const [k, v] of this.map.values()) yield [k, v];
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries();
	}

	forEach(callback: (value: V, key: K, map: this) => void, thisArg?: unknown): void {
		for (const [k, v] of this.map.values()) callback.call(thisArg, v, k, this);
	}
}
