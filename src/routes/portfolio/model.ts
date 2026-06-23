import type {
	OpenGraphScraperRequest,
	OpenGraphScraperResponse
} from '$api/open-graph-scraper/model';
import { asset } from '$app/paths';
import { getDefaultHeaders } from '$shared/get-default-headers';
import { HttpStatus } from '$shared/http-status';

export enum Label {
	CLIENT,
	IN_HOUSE,
	OPEN_SOURCE,
	PARTNER
}

export const LABEL_TO_PROPERTY_MAP: Record<Label, { text: string; backgroundClass: string }> = {
	[Label.CLIENT]: {
		text: `portfolio.label.client`,
		backgroundClass: 'bg-green-600'
	},
	[Label.IN_HOUSE]: {
		text: 'portfolio.label.inHouse',
		backgroundClass: 'bg-amber-500'
	},
	[Label.OPEN_SOURCE]: {
		text: 'portfolio.label.openSource',
		backgroundClass: 'bg-purple-600'
	},
	[Label.PARTNER]: {
		text: 'portfolio.label.partner',
		backgroundClass: 'bg-sky-600'
	}
};

export type MediaItem = {
	url: string;
	label: string;
};

export type PortfolioBaseItem = {
	url: string;
	key: string;
	labels: Label[];
	endDate: Date | 'now';
	startDate: Date;
	descriptionLength: number;
	mediaList: MediaItem[];
	ogImageReplacement?: string;
};

const portfolioListBase: PortfolioBaseItem[] = [
	{
		url: "https://www.rk-wk.eu/2026/testy/en/home/",
		key: 'rkwk',
		labels: [Label.CLIENT],
		endDate: 'now',
		startDate: new Date(2026, 4, 20),
		descriptionLength: 3,
		mediaList: [],
	},
	{
		url: 'https://www.viviena.pl/',
		key: 'viviena',
		labels: [Label.CLIENT, Label.PARTNER],
		endDate: 'now',
		startDate: new Date(2026, 4, 1),
		descriptionLength: 3,
		mediaList: [],
		ogImageReplacement: asset('/portfolio/viviena/og-image-replacement.png')
	},
	{
		url: 'https://www.atexprint.pl/',
		key: 'atexprint',
		labels: [Label.CLIENT],
		endDate: new Date(2026, 4, 1),
		startDate: new Date(2026, 1, 15),
		descriptionLength: 3,
		mediaList: []
	},
	{
		url: 'https://bezstresowo.org/',
		key: 'bezstresowo',
		labels: [Label.CLIENT],
		endDate: new Date(2026, 2, 21),
		startDate: new Date(2025, 11, 1),
		descriptionLength: 3,
		mediaList: []
	},
	{
		url: 'https://powerivanchukova.com',
		key: 'powerivanchukova',
		labels: [Label.CLIENT],
		endDate: new Date(2025, 7, 16),
		startDate: new Date(2025, 5, 1),
		descriptionLength: 4,
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
		descriptionLength: 2,
		mediaList: [],
		ogImageReplacement: asset('/portfolio/ngx-meta-pixel/og-image-replacement.png')
	},
	{
		url: 'https://zuzannalucinska.pl/',
		key: 'zuzannaLucinska',
		labels: [Label.CLIENT],
		endDate: new Date(2025, 5, 1),
		startDate: new Date(2025, 4, 15),
		descriptionLength: 0,
		mediaList: [],
		ogImageReplacement: asset('/portfolio/zuzanna-lucinska/og-image-replacement.png')
	}
];

const sortedPortfolioListBase = portfolioListBase.sort(
	(a, b) => b.startDate.getTime() - a.startDate.getTime()
);

export async function getCompletePortfolioItems() {
	return sortedPortfolioListBase.map(async ({ descriptionLength, key, mediaList, ...val }) => {
		const newVal = {
			...val,
			descriptionParts: Array.from({ length: descriptionLength }).map(
				(_, i) => `portfolio.${key}.description.${i}`
			),
			shortDescription: `portfolio.${key}.shortDescription`,
			title: `portfolio.${key}.title`,
			mediaList: mediaList.map(({ url, label }) => ({
				url,
				label: `portfolio.${key}.mediaList.${label}`
			}))
		};

		const body = { url: val.url } satisfies OpenGraphScraperRequest;

		const response = await fetch('/api/open-graph-scraper', {
			method: 'POST',
			headers: getDefaultHeaders(),
			body: JSON.stringify(body)
		});

		if (response.status !== HttpStatus.OK) {
			return { ...newVal, ogImage: null };
		}

		const { image } = (await response.json()) as OpenGraphScraperResponse;

		return { ...newVal, ogImage: image };
	});
}

export type PortfolioList = Awaited<ReturnType<typeof getCompletePortfolioItems>>;

export type PortfolioItem = Awaited<PortfolioList[number]>;
