import { IsDefined, IsUrl } from 'class-validator';
import type { ImageObject } from 'open-graph-scraper/types';

export class OpenGraphScraperRequest {
	@IsUrl()
	@IsDefined()
	declare url: string;
}

export class OpenGraphScraperResponse {
	declare image: ImageObject;
}
