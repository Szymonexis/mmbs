import {
	SessionStorageKey,
	readValueFromSessionStorage,
	setValueInSessionStorage
} from '$shared/browser/session-storage';
import type { MemberKey } from '../../model';
import { GameState } from '../game/game-state';
import type { Point } from '../game/game-view';

export const EASTER_EGG_SEQUENCE: readonly MemberKey[] = ['maciej', 'maja', 'bartek', 'szymon'];

export const FLIP_MS = 700;
export const ADMIRE_MS = 1000;
export const FADE_MS = 500;
export const OSCILLATOR_TICK_MS = 300;
export const OSCILLATOR_MARGIN_CELLS = 2;

const BOUNDS_SAMPLE_GENERATIONS = 60;

export function nextProgress(progress: number, clicked: MemberKey): number {
	if (clicked === EASTER_EGG_SEQUENCE[progress]) {
		return progress + 1;
	}
	return clicked === EASTER_EGG_SEQUENCE[0] ? 1 : 0;
}

let foundWithoutStorage = false;

export function hasFoundEasterEgg(): boolean {
	return (
		foundWithoutStorage ||
		readValueFromSessionStorage(SessionStorageKey.EASTER_EGG_FOUND) === 'true'
	);
}

export function markEasterEggFound(): void {
	foundWithoutStorage = !setValueInSessionStorage(SessionStorageKey.EASTER_EGG_FOUND, 'true');
}

export function oscillatorBounds(cells: Point[]): [min: Point, max: Point] {
	const state = new GameState();
	state.load(cells);

	let [min_x, min_y, max_x, max_y] = [Infinity, Infinity, -Infinity, -Infinity];
	for (let generation = 0; generation < BOUNDS_SAMPLE_GENERATIONS; generation++) {
		for (const {
			pos: [x, y]
		} of state.world) {
			min_x = Math.min(min_x, x);
			min_y = Math.min(min_y, y);
			max_x = Math.max(max_x, x);
			max_y = Math.max(max_y, y);
		}
		state.nextIteration();
	}

	return [
		[min_x, min_y],
		[max_x, max_y]
	];
}
