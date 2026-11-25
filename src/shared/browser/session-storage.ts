import { browser } from '$app/environment';
import { PUBLIC_APP_HASH } from '$env/static/public';

export enum SessionStorageKey {
	EASTER_EGG_FOUND = 'easter-egg-found'
}

export function readValueFromSessionStorage(key: SessionStorageKey) {
	if (!browser) throw new Error('Must have access to browser in order to access sessionStorage');

	return sessionStorage.getItem(`mmbs-${PUBLIC_APP_HASH}-${key}`);
}

export function setValueInSessionStorage(key: SessionStorageKey, value: string) {
	if (!browser) throw new Error('Must have access to browser in order to access sessionStorage');

	sessionStorage.setItem(`mmbs-${PUBLIC_APP_HASH}-${key}`, value);
}
