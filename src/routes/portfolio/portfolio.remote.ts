import ogs from 'open-graph-scraper';
import type { ImageObject } from 'open-graph-scraper/types';

import { query } from '$app/server';

import * as yup from 'yup';

export const getOgImage = query(
	yup.string().required(),
	async (url: string): Promise<ImageObject | null> => {
		try {
			const { error: ogsError, result } = await ogs({ url });

			if (ogsError) {
				return null;
			}

			return result.ogImage?.[0] ?? null;
		} catch {
			// Scrape failures are not exceptional — the UI falls back to a placeholder image.
			return null;
		}
	}
);
