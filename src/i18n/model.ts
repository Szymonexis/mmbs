export enum Locale {
	enUS = 'en-US',
	plPL = 'pl-PL'
}

export const LOCALES_MAP = {
	[Locale.enUS]: {
		label: 'language.english',
		flag: '🇺🇸'
	},
	[Locale.plPL]: {
		label: 'language.polish',
		flag: '🇵🇱'
	}
} as const;
