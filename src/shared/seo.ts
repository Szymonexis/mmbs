import type { TranslationDictionary } from '$i18n';

export const SITE_ORIGIN = 'https://mmbs.pl';
export const SITE_NAME = 'MMBS Studio';

export type PageMetaKey = keyof TranslationDictionary['meta'];
export type OgPageKey = Exclude<PageMetaKey, '404'>;

export const PAGES: { key: OgPageKey; path: string; priority: number }[] = [
	{ key: 'home', path: '/', priority: 1 },
	{ key: 'services', path: '/services', priority: 0.8 },
	{ key: 'portfolio', path: '/portfolio', priority: 0.8 },
	{ key: 'faq', path: '/faq', priority: 0.8 }
];

export function ogImagePath(key: OgPageKey): string {
	return `/og/${key}.png`;
}
