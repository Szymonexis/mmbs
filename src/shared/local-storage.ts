import { PUBLIC_APP_HASH } from '$env/static/public';

export enum LocalStorageKey {
	LOCALE = 'locale'
}

export function readValueFromLocalStorage(key: LocalStorageKey) {
	return localStorage.getItem(`mmbs-${PUBLIC_APP_HASH}-${key}`);
}

export function setValueInLocalStorage(key: LocalStorageKey, value: string) {
	localStorage.setItem(`mmbs-${PUBLIC_APP_HASH}-${key}`, value);
}
