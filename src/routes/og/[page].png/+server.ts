import { error } from '@sveltejs/kit';

import { enUS } from '$i18n/translations/en-US';
import { renderOgImage } from '$lib/server/og/render-og-image';
import { PAGES } from '$shared/seo';

import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => PAGES.map(({ key }) => ({ page: key }));

export const GET: RequestHandler = async ({ params }) => {
	const page = PAGES.find(({ key }) => key === params.page);

	if (!page) {
		error(404);
	}

	const png = await renderOgImage(enUS.header[page.key], enUS.meta[page.key].description);

	return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
