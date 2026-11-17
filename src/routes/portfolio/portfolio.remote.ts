import type { ImageObject } from 'open-graph-scraper/types';

import { query } from '$app/server';

import * as yup from 'yup';

import { getScrapedOgImageUrls } from './model';
import { getCachedOgImage } from './og-image.server';

export const getOgImage = query(
	yup.string().required().oneOf(getScrapedOgImageUrls()),
	(url: string): Promise<ImageObject | null> => getCachedOgImage(url)
);
