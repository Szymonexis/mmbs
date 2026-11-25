import type { TranslationDictionary } from '$i18n';
import type { Point } from '../game/game-view';

export type PatternKey = keyof TranslationDictionary['cgol']['patterns'];

const ALIVE = 'O';

export const PATTERNS = {
	glider: ['.O.', '..O', 'OOO'],
	lwss: ['O..O.', '....O', 'O...O', '.OOOO'],
	pulsar: [
		'..OOO...OOO..',
		'.............',
		'O....O.O....O',
		'O....O.O....O',
		'O....O.O....O',
		'..OOO...OOO..',
		'.............',
		'..OOO...OOO..',
		'O....O.O....O',
		'O....O.O....O',
		'O....O.O....O',
		'.............',
		'..OOO...OOO..'
	],
	pentadecathlon: ['..O....O..', 'OO.OOOO.OO', '..O....O..'],
	gosperGliderGun: [
		'........................O...........',
		'......................O.O...........',
		'............OO......OO............OO',
		'...........O...O....OO............OO',
		'OO........O.....O...OO..............',
		'OO........O...O.OO....O.O...........',
		'..........O.....O.......O...........',
		'...........O...O....................',
		'............OO......................'
	],
	rPentomino: ['.OO', 'OO.', '.O.'],
	acorn: ['.O.....', '...O...', 'OO..OOO'],
	diehard: ['......O.', 'OO......', '.O...OOO']
} as const satisfies Record<PatternKey, readonly string[]>;

export const PATTERN_KEYS = Object.keys(PATTERNS) as PatternKey[];

export function randomPatternKey(): PatternKey {
	return PATTERN_KEYS[Math.floor(Math.random() * PATTERN_KEYS.length)];
}

export function patternCells(rows: readonly string[]): Point[] {
	const width = Math.max(...rows.map((row) => row.length));
	const offset_x = Math.floor(width / 2);
	const offset_y = Math.floor(rows.length / 2);

	return rows.flatMap((row, y) =>
		[...row].flatMap((char, x): Point[] => (char === ALIVE ? [[x - offset_x, y - offset_y]] : []))
	);
}
