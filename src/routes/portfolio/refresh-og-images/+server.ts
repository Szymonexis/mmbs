import { env } from '$env/dynamic/private';
import { HttpStatus } from '$shared/http-status';
import { error, json } from '@sveltejs/kit';

import { getScrapedOgImageUrls } from '../model';
import { refreshOgImage } from '../og-image.server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	if (!env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${env.CRON_SECRET}`) {
		error(HttpStatus.UNAUTHORIZED, 'Unauthorized');
	}

	const urls = getScrapedOgImageUrls();
	const images = await Promise.all(urls.map(refreshOgImage));
	const failed = urls.filter((_, index) => images[index] === null);

	return json({ refreshed: urls.length - failed.length, failed });
};
