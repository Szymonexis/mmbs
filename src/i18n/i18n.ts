import { derived, writable } from 'svelte/store';

import { Locale } from './model';
import { enUS, type TranslationDictionary } from './translations/en-US';
import { plPL } from './translations/pl-PL';

export type { TranslationDictionary };

export const currentLocale = writable(Locale.enUS);

const translations: Record<Locale, TranslationDictionary> = {
	[Locale.enUS]: enUS,
	[Locale.plPL]: plPL
};

export const t = derived(currentLocale, ($currentLocale) => translations[$currentLocale]);
