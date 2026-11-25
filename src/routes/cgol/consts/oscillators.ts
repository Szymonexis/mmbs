import { PATTERNS } from './patterns';

export const OSCILLATORS = {
	blinker: ['OOO'],
	toad: ['.OOO', 'OOO.'],
	beacon: ['OO..', 'OO..', '..OO', '..OO'],
	clock: ['..O.', 'O.O.', '.O.O', '.O..'],
	caterer: ['..O.....', 'O...OOOO', 'O...O...', 'O.......', '...O....', '.OO.....'],
	mold: ['...OO.', '..O..O', 'O..O.O', '....O.', 'O.OO..', '.O....'],
	octagon2: [
		'...OO...',
		'..O..O..',
		'.O....O.',
		'O......O',
		'O......O',
		'.O....O.',
		'..O..O..',
		'...OO...'
	],
	figureEight: ['OO....', 'OO.O..', '....O.', '.O....', '..O.OO', '....OO'],
	kokGalaxy: [
		'..O..O.O.',
		'OO.O.OOO.',
		'.O......O',
		'OO.....O.',
		'.........',
		'.O.....OO',
		'O......O.',
		'.OOO.O.OO',
		'.O.O..O..'
	],
	tumbler: ['.O.....O.', 'O.O...O.O', 'O..O.O..O', '..O...O..', '..OO.OO..'],
	pulsar: PATTERNS.pulsar,
	pentadecathlon: PATTERNS.pentadecathlon
} as const satisfies Record<string, readonly string[]>;

export type OscillatorKey = keyof typeof OSCILLATORS;

export const OSCILLATOR_KEYS = Object.keys(OSCILLATORS) as OscillatorKey[];
