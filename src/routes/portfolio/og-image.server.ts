import { getCache } from '@vercel/functions';
import ogs from 'open-graph-scraper';
import type { ImageObject } from 'open-graph-scraper/types';

const CACHE_TTL_SECONDS = 60 * 60 * 48;

const cache = getCache({ namespace: 'og-image' });

async function bestEffort<T>(cacheOperation: () => Promise<T>): Promise<T | null> {
	try {
		return await cacheOperation();
	} catch {
		return null;
	}
}

async function scrapeOgImage(url: string): Promise<ImageObject | null> {
	try {
		const { error, result } = await ogs({ url });

		return error ? null : (result.ogImage?.[0] ?? null);
	} catch {
		return null;
	}
}

export async function refreshOgImage(url: string): Promise<ImageObject | null> {
	const image = await scrapeOgImage(url);

	if (image) {
		await bestEffort(() => cache.set(url, image, { ttl: CACHE_TTL_SECONDS }));
	}

	return image;
}

export async function getCachedOgImage(url: string): Promise<ImageObject | null> {
	const cached = (await bestEffort(() => cache.get(url))) as ImageObject | null;

	return cached ?? refreshOgImage(url);
}
