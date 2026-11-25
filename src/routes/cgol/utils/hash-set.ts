import type { Hashable } from './hashable';

export class HashSet<T extends Hashable> implements Iterable<T> {
	private map = new Map<string | number, T>();

	constructor(items?: Iterable<T>) {
		if (items) for (const item of items) this.add(item);
	}

	add(item: T): this {
		const key = item.hashKey();
		if (!this.map.has(key)) this.map.set(key, item);
		return this;
	}

	has(item: T): boolean {
		return this.map.has(item.hashKey());
	}

	delete(item: T): boolean {
		return this.map.delete(item.hashKey());
	}

	clear(): void {
		this.map.clear();
	}

	get size(): number {
		return this.map.size;
	}

	values(): IterableIterator<T> {
		return this.map.values();
	}

	[Symbol.iterator](): IterableIterator<T> {
		return this.map.values();
	}
}
