import { IsDefined, IsUrl } from 'class-validator';
import ogs from 'open-graph-scraper';
import type { ImageObject } from 'open-graph-scraper/types';

import { query } from '$app/server';
import { validateDto } from '$shared/server/validate-dto';

// Not exported on purpose — remote files may only export remote functions.
class OpenGraphScraperRequest {
	@IsUrl()
	@IsDefined()
	declare url: string;
}

export const getOgImage = query('unchecked', async (url: string): Promise<ImageObject | null> => {
	const dto = await validateDto({ url }, OpenGraphScraperRequest);

	try {
		const { error: ogsError, result } = await ogs({ url: dto.url });

		if (ogsError) {
			return null;
		}

		return result.ogImage?.[0] ?? null;
	} catch {
		// Scrape failures are not exceptional — the UI falls back to a placeholder image.
		return null;
	}
});
