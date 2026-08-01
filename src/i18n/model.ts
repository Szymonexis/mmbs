export enum Locale {
	enUS = 'en-US',
	plPL = 'pl-PL'
}

export const LOCALES_MAP = {
	[Locale.enUS]: {
		label: 'English',
		flag: '/flags/en-US.svg'
	},
	[Locale.plPL]: {
		label: 'Polski',
		flag: '/flags/pl-PL.svg'
	}
} as const;

// Widens `as const` literals to their base types while preserving keys, tuple
// lengths and function signatures. See .claude/docs/i18n.md.
export type DeepWiden<T> = T extends (...args: never[]) => unknown
	? T
	: T extends object
		? { [K in keyof T]: DeepWiden<T[K]> }
		: T extends string
			? string
			: T extends number
				? number
				: T extends boolean
					? boolean
					: T;
