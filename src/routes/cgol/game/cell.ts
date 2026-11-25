import type { Hashable } from '../utils/hashable';

export class Cell implements Hashable {
	private readonly __key: `${number},${number}`;
	private readonly __pos: [number, number];

	get pos() {
		return this.__pos;
	}

	get key() {
		return this.__key;
	}

	constructor([x, y]: [number, number]) {
		this.__pos = [x, y];
		this.__key = `${x},${y}`;
	}

	hashKey(): string | number {
		return this.__key;
	}
}
