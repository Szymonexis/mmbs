import { derived, writable } from 'svelte/store';

import { Locale } from './model';
import { isNil } from 'lodash-es';

import enUS from './translations/en-US.json';
import plPL from './translations/pl-PL.json';

export const currentLocale = writable(Locale.enUS);

const translations = {
	[Locale.enUS]: enUS,
	[Locale.plPL]: plPL
};

function parseTranslation(locale: Locale, key: string, vars?: Record<string, string>) {
	const translationFile = translations[locale];

	if (isNil(translationFile) || isNil(key)) {
		return key;
	}

	const keys = key.split('.');

	let text = translationFile as any;
	for (const k of keys) {
		try {
			// this will throw an error if the key doesn't exist
			text = text[k];
		} catch {
			return key;
		}
	}

	if (isNil(text) || typeof text !== 'string') {
		return key;
	}

	if (!isNil(vars)) {
		Object.keys(vars).forEach((k) => {
			const regex = new RegExp(`{{\\s*${k}\\s*}}`, 'g');
			text = text.replace(regex, vars[k]);
		});
	}

	return text;
}

export const translate = derived(currentLocale, ($currentLocale) => (key: string, vars = {}) => {
	return parseTranslation($currentLocale, key, vars);
});
