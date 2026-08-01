import type { TranslationDictionary } from '$i18n';

export const HEADER_ITEMS: {
	label: keyof TranslationDictionary['header'];
	href: string;
	inverted?: boolean;
	underline?: boolean;
}[] = [
	{ label: 'home', href: '/', underline: true },
	{ label: 'services', href: '/services', underline: true },
	{ label: 'portfolio', href: '/portfolio', underline: true },
	{ label: 'faq', href: '/faq', underline: true },
	{ label: 'contactUs', href: '/#contactUs', inverted: true }
];
