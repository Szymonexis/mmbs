import { PUBLIC_APP_HASH } from '$env/static/public';

export enum LocalStorageKey {
	LOCALE = 'locale'
}

export function readValueFromLocalStorage(key: LocalStorageKey) {
	return localStorage.getItem(`innovio-${PUBLIC_APP_HASH}-${key}`);
}

export function setValueInLocalStorage(key: LocalStorageKey, value: string) {
	localStorage.setItem(`innovio-${PUBLIC_APP_HASH}-${key}`, value);
}
