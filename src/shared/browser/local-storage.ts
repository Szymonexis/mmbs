import { browser } from '$app/environment';
import { PUBLIC_APP_HASH } from '$env/static/public';

export enum LocalStorageKey {
	LOCALE = 'locale'
}

export function readValueFromLocalStorage(key: LocalStorageKey) {
	if (!browser) throw new Error('Must have access to browser in order to access localStorage');

	return localStorage.getItem(`mmbs-${PUBLIC_APP_HASH}-${key}`);
}

export function setValueInLocalStorage(key: LocalStorageKey, value: string) {
	if (!browser) throw new Error('Must have access to browser in order to access localStorage');

	localStorage.setItem(`mmbs-${PUBLIC_APP_HASH}-${key}`, value);
}
