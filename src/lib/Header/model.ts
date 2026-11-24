import { resolve } from '$app/paths';
import type { ResolvedPathname } from '$app/types';
import type { TranslationDictionary } from '$i18n';

export const HEADER_ITEMS: {
	label: keyof TranslationDictionary['header'];
	href: ResolvedPathname;
	inverted?: boolean;
	underline?: boolean;
}[] = [
	{ label: 'home', href: resolve('/'), underline: true },
	{ label: 'services', href: resolve('/services'), underline: true },
	{ label: 'portfolio', href: resolve('/portfolio'), underline: true },
	{ label: 'faq', href: resolve('/faq'), underline: true },
	{ label: 'contactUs', href: resolve('/#contactUs'), inverted: true }
];
