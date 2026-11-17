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
	priority: number;
	mediaList: MediaItem[];
	ogImageReplacement?: string;
};

const HOME_PORTFOLIO_LIMIT = 5;

export const MISSING_IMAGE_URL =
	'https://placehold.co/1600x900?font=roboto&text=No%20Image%20Found';

const portfolioListBase: PortfolioItem[] = [
	{
		url: 'https://oddambutelki.pl/',
		key: 'oddamButelki',
		labels: [Label.CLIENT],
		endDate: 'now',
		startDate: new Date(2026, 9, 11),
		priority: 0,
		mediaList: [],
		ogImageReplacement: asset('/portfolio/oddam-butelki/og-image-replacement.webp')
	},
	{
		url: 'https://www.viviena.pl/',
		key: 'viviena',
		labels: [Label.CLIENT, Label.PARTNER],
		endDate: new Date(2026, 7, 3),
		startDate: new Date(2026, 4, 1),
		priority: 0,
		mediaList: []
	},
	{
		url: 'https://www.atexprint.pl/',
		key: 'atexprint',
		labels: [Label.CLIENT],
		endDate: new Date(2026, 4, 1),
		startDate: new Date(2026, 1, 15),
		priority: 0,
		mediaList: []
	},
	{
		url: 'https://hyzo.io/',
		key: 'hyzo',
		labels: [Label.PARTNER],
		endDate: 'now',
		startDate: new Date(2026, 0, 9),
		priority: 1,
		mediaList: [],
		ogImageReplacement: asset('/portfolio/hyzo/og-image-replacement.webp')
	},
	{
		url: 'https://bezstresowo.org/',
		key: 'bezstresowo',
		labels: [Label.CLIENT],
		endDate: new Date(2026, 2, 21),
		startDate: new Date(2025, 11, 1),
		priority: 0,
		mediaList: []
	},
	{
		url: 'https://powerivanchukova.com',
		key: 'powerivanchukova',
		labels: [Label.CLIENT],
		endDate: new Date(2025, 7, 16),
		startDate: new Date(2025, 5, 1),
		priority: 0,
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
		endDate: new Date(2026, 2, 28),
		startDate: new Date(2025, 1, 17),
		priority: 0,
		mediaList: [],
		ogImageReplacement: asset('/portfolio/ngx-meta-pixel/og-image-replacement.png')
	},
	{
		url: 'https://zuzannalucinska.pl/',
		key: 'zuzannaLucinska',
		labels: [Label.CLIENT],
		endDate: new Date(2025, 5, 1),
		startDate: new Date(2025, 4, 15),
		priority: 0,
		mediaList: [],
		ogImageReplacement: asset('/portfolio/zuzanna-lucinska/og-image-replacement.png')
	}
];

function endTime({ endDate }: PortfolioItem): number {
	return endDate === 'now' ? Number.MAX_SAFE_INTEGER : endDate.getTime();
}

function byMostRecent(a: PortfolioItem, b: PortfolioItem): number {
	return endTime(b) - endTime(a) || b.startDate.getTime() - a.startDate.getTime();
}

export function getCompletePortfolioItems(): PortfolioItem[] {
	return [...portfolioListBase].sort(byMostRecent);
}

export function getHomePortfolioItems(): PortfolioItem[] {
	return [...portfolioListBase]
		.sort((a, b) => b.priority - a.priority || byMostRecent(a, b))
		.slice(0, HOME_PORTFOLIO_LIMIT);
}

export function getScrapedOgImageUrls(): string[] {
	return portfolioListBase.filter((item) => !item.ogImageReplacement).map((item) => item.url);
}

export type PortfolioList = ReturnType<typeof getCompletePortfolioItems>;
