import { browser } from '$app/environment';
import { hasFoundEasterEgg } from './trigger/model';

export const ssr = false;

export function load() {
	return { unlocked: browser && hasFoundEasterEgg() };
}
