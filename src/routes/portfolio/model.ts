import type {
	OpenGraphScraperRequest,
	OpenGraphScraperResponse
} from '$api/open-graph-scraper/model';
import { getDefaultHeaders } from '$shared/get-default-headers';
import { HttpStatus } from '$shared/http-status';

export enum Label {
	CLIENT,
	IN_HOUSE,
	OPEN_SOURCE
}

export const LABEL_TEXT_MAP: Record<Label, string> = {
	[Label.CLIENT]: `portfolio.label.client`,
	[Label.IN_HOUSE]: 'portfolio.label.inHouse',
	[Label.OPEN_SOURCE]: 'portfolio.label.openSource'
};

type MediaItem = {
	type: 'video' | 'image';
	src: string;
	alt: string;
};

export type PortfolioBaseItem = {
	url: string;
	key: string;
	labels: Label[];
	date: Date;
	descriptionLength: number;
	mediaList: MediaItem[];
};

const portfolioListBase: PortfolioBaseItem[] = [
	{
		url: 'https://powerivanchukova.com',
		key: 'powerivanchukova',
		labels: [Label.CLIENT],
		date: new Date(2025, 7, 16),
		descriptionLength: 1,
		mediaList: [
			{
				type: 'video',
				alt: 'Client instagram story',
				src: '/portfolio/powerivanchukova/story.mp4'
			}
		]
	},
	{
		url: 'https://www.npmjs.com/package/ngx-meta-pixel',
		key: 'ngxMetaPixel',
		labels: [Label.IN_HOUSE, Label.OPEN_SOURCE],
		date: new Date(2025, 1, 17),
		descriptionLength: 1,
		mediaList: []
	}
];

export const PORTFOLIO_LENGTH = portfolioListBase.length;

const sortedPortfolioListBase = portfolioListBase.sort(
	(a, b) => b.date.getTime() - a.date.getTime()
);

export async function getCompletePortfolioItems() {
	return await Promise.all(
		sortedPortfolioListBase.map(async ({ descriptionLength, key, ...val }) => {
			const newVal = {
				...val,
				descriptionParts: Array.from({ length: descriptionLength }).map(
					(_, i) => `portfolio.${key}.description.${i}`
				),
				shortDescription: `portfolio.${key}.shortDescription`,
				title: `portfolio.${key}.title`
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
		})
	);
}

export type PortfolioList = Awaited<ReturnType<typeof getCompletePortfolioItems>>;
