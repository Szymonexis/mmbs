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

			for (let x = 0; x < rows.length; x++) {
				const row = rows[x];
				for (let y = 0; y < row.length; y++) {
					const isAlive = row[y];

					if (isAlive) {
						this.__world.add(new Cell([x + off_x, y + off_y]));
					}
				}
			}
		}
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
