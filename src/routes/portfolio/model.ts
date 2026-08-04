import { asset } from '$app/paths';
import type { TranslationDictionary } from '$i18n';

export enum Label {
	CLIENT,
	IN_HOUSE,
	OPEN_SOURCE,
	PARTNER
}

export type PortfolioKey = keyof TranslationDictionary['portfolio']['projects'];

export const LABEL_TO_PROPERTY_MAP: Record<
	Label,
	{ key: keyof TranslationDictionary['portfolio']['label']; backgroundClass: string }
> = {
	[Label.CLIENT]: {
		key: 'client',
		backgroundClass: 'bg-green-600'
	},
	[Label.IN_HOUSE]: {
		key: 'inHouse',
		backgroundClass: 'bg-amber-500'
	},
	[Label.OPEN_SOURCE]: {
		key: 'openSource',
		backgroundClass: 'bg-purple-600'
	},
	[Label.PARTNER]: {
		key: 'partner',
		backgroundClass: 'bg-sky-600'
	}
};

export type MediaItem = {
	url: string;
	label: string;
};

export type PortfolioItem = {
	url: string;
	key: PortfolioKey;
	labels: Label[];
	endDate: Date | 'now';
	startDate: Date;
	mediaList: MediaItem[];
	ogImageReplacement?: string;
};

const portfolioListBase: PortfolioItem[] = [
	// NOTE: rkwk project has been paused (likely for good) — keep commented out unless it returns.
	// {
	// 	url: "https://www.rk-wk.eu/2026/testy/en/home/",
	// 	key: 'rkwk',
	// 	labels: [Label.CLIENT],
	// 	endDate: 'now',
	// 	startDate: new Date(2026, 4, 20),
	// 	mediaList: [],
	// 	ogImageReplacement: asset('/portfolio/rkwk/og-image-replacement.svg')
	// },
	{
		url: 'https://www.viviena.pl/',
		key: 'viviena',
		labels: [Label.CLIENT, Label.PARTNER],
		endDate: new Date(2026, 7, 3),
		startDate: new Date(2026, 4, 1),
		mediaList: [],
	},
	{
		url: 'https://www.atexprint.pl/',
		key: 'atexprint',
		labels: [Label.CLIENT],
		endDate: new Date(2026, 4, 1),
		startDate: new Date(2026, 1, 15),
		mediaList: []
	},
	{
		url: 'https://bezstresowo.org/',
		key: 'bezstresowo',
		labels: [Label.CLIENT],
		endDate: new Date(2026, 2, 21),
		startDate: new Date(2025, 11, 1),
		mediaList: []
	},
	{
		url: 'https://powerivanchukova.com',
		key: 'powerivanchukova',
		labels: [Label.CLIENT],
		endDate: new Date(2025, 7, 16),
		startDate: new Date(2025, 5, 1),
		mediaList: [
			{
				url: asset('/portfolio/powerivanchukova/story.mp4'),
				label: 'story'
			}
		]
	},
	{
		url: 'https://www.npmjs.com/package/ngx-meta-pixel',
		key: 'ngxMetaPixel',
		labels: [Label.IN_HOUSE, Label.OPEN_SOURCE],
		endDate: 'now',
		startDate: new Date(2025, 1, 17),
		mediaList: [],
		ogImageReplacement: asset('/portfolio/ngx-meta-pixel/og-image-replacement.png')
	},
	{
		url: 'https://zuzannalucinska.pl/',
		key: 'zuzannaLucinska',
		labels: [Label.CLIENT],
		endDate: new Date(2025, 5, 1),
		startDate: new Date(2025, 4, 15),
		mediaList: [],
		ogImageReplacement: asset('/portfolio/zuzanna-lucinska/og-image-replacement.png')
	}
];

export function getCompletePortfolioItems(): PortfolioItem[] {
	return [...portfolioListBase].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
}

export type PortfolioList = ReturnType<typeof getCompletePortfolioItems>;
