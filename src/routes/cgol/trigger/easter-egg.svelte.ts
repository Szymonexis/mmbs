import type { MemberKey } from '../../model';
import { OSCILLATOR_KEYS, type OscillatorKey } from '../consts/oscillators';
import { ADMIRE_MS, EASTER_EGG_SEQUENCE, FLIP_MS, nextProgress } from './model';

type RevealedOscillators = Partial<Record<MemberKey, OscillatorKey>>;

function pickOscillator(taken: RevealedOscillators): OscillatorKey {
	const takenKeys = Object.values(taken);
	const available = OSCILLATOR_KEYS.filter((key) => !takenKeys.includes(key));
	return available[Math.floor(Math.random() * available.length)];
}

export class EasterEgg {
	revealed: RevealedOscillators = $state({});
	lastShown: RevealedOscillators = $state({});
	solved = $state(false);

	private progress = 0;
	private solveTimeout: ReturnType<typeof setTimeout> | undefined;

	click(member: MemberKey) {
		if (this.progress === EASTER_EGG_SEQUENCE.length) return;

		this.progress = nextProgress(this.progress, member);

		const revealed: RevealedOscillators = {};
		for (const key of EASTER_EGG_SEQUENCE.slice(0, this.progress)) {
			revealed[key] = this.revealed[key] ?? pickOscillator(revealed);
		}
		this.revealed = revealed;
		this.lastShown = { ...this.lastShown, ...revealed };

		if (this.progress === EASTER_EGG_SEQUENCE.length) {
			this.solveTimeout = setTimeout(() => (this.solved = true), FLIP_MS + ADMIRE_MS);
		}
	}

	dispose() {
		clearTimeout(this.solveTimeout);
	}
}
