import { Cell } from './cell';
import { HashMap } from '../utils/hash-map';
import { HashSet } from '../utils/hash-set';
import { COOL_CELLS } from '../consts/cool-cells';

export class GameState {
	private __world = new HashSet<Cell>();

	get world() {
		return this.__world;
	}

	constructor(patterns: { offset: [number, number]; pattern: keyof typeof COOL_CELLS }[] = []) {
		for (const {
			offset: [off_x, off_y],
			pattern
		} of patterns) {
			const rows = COOL_CELLS[pattern];

			for (let y = 0; y < rows.length; y++) {
				const row = rows[y];
				for (let x = 0; x < row.length; x++) {
					const isAlive = row[x];

					if (isAlive) {
						this.__world.add(new Cell([x + off_x, y + off_y]));
					}
				}
			}
		}
	}

	add(pos: [number, number]): void {
		this.__world.add(new Cell(pos));
	}

	addLine([from_x, from_y]: [number, number], [to_x, to_y]: [number, number]): void {
		const distance_x = Math.abs(to_x - from_x);
		const distance_y = -Math.abs(to_y - from_y);
		const step_x = from_x < to_x ? 1 : -1;
		const step_y = from_y < to_y ? 1 : -1;
		let error = distance_x + distance_y;
		let x = from_x;
		let y = from_y;

		for (;;) {
			this.add([x, y]);
			if (x === to_x && y === to_y) return;

			const doubledError = 2 * error;
			if (doubledError >= distance_y) {
				error += distance_y;
				x += step_x;
			}
			if (doubledError <= distance_x) {
				error += distance_x;
				y += step_y;
			}
		}
	}

	load(positions: Iterable<[number, number]>): void {
		this.clear();
		for (const pos of positions) {
			this.add(pos);
		}
	}

	clear(): void {
		this.__world = new HashSet<Cell>();
	}

	nextIteration(): void {
		const neighbourCounts = new HashMap<Cell, number>();

		for (const cell of this.__world) {
			const [x, y] = cell.pos;

			if (!neighbourCounts.has(cell)) {
				neighbourCounts.set(cell, 0);
			}

			for (let dx = -1; dx <= 1; dx++) {
				for (let dy = -1; dy <= 1; dy++) {
					if (dx === 0 && dy === 0) continue;

					const newCell = new Cell([x + dx, y + dy]);
					neighbourCounts.set(newCell, (neighbourCounts.get(newCell) ?? 0) + 1);
				}
			}
		}

		const nextWorld = new HashSet<Cell>();
		for (const [cell, neighbors] of neighbourCounts) {
			const alive = this.__world.has(cell);

			if (neighbors === 3 || (alive && neighbors === 2)) {
				nextWorld.add(cell);
			}
		}

		this.__world = nextWorld;
	}
}
