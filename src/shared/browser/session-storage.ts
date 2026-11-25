import { browser } from '$app/environment';
import { PUBLIC_APP_HASH } from '$env/static/public';

export enum SessionStorageKey {
	EASTER_EGG_FOUND = 'easter-egg-found'
}

export function readValueFromSessionStorage(key: SessionStorageKey): string | null {
	if (!browser) throw new Error('Must have access to browser in order to access sessionStorage');

	try {
		return sessionStorage.getItem(`mmbs-${PUBLIC_APP_HASH}-${key}`);
	} catch {
		return null;
	}
}

export function setValueInSessionStorage(key: SessionStorageKey, value: string): boolean {
	if (!browser) throw new Error('Must have access to browser in order to access sessionStorage');

	try {
		sessionStorage.setItem(`mmbs-${PUBLIC_APP_HASH}-${key}`, value);
		return true;
	} catch {
		return false;
	}
}
