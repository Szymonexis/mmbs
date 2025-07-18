export enum Locale {
	enUS = 'en-US',
	plPL = 'pl-PL'
}

export const LOCALES_MAP = {
	[Locale.enUS]: {
		label: 'English',
		flag: '🇺🇸'
	},
	[Locale.plPL]: {
		label: 'Polski',
		flag: '🇵🇱'
	}
} as const;
