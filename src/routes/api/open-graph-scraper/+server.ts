import { OpenGraphScraperRequest, OpenGraphScraperResponse } from './model';
import { validateBody } from '$shared/server/validate-body';
import ogs from 'open-graph-scraper';
import { json } from '@sveltejs/kit';
import { HttpStatus } from '$shared/http-status';
import { isNil } from 'lodash-es';

export async function POST({ request }) {
	const body = await request.json();

	const validationResult = await validateBody(body, OpenGraphScraperRequest);
	if (validationResult.type === 'error') {
		return validationResult.response;
	}

	const {
		dto: { url }
	} = validationResult;

	const ogsResult = await ogs({ url });

	if (ogsResult.error) {
		return json({ error: ogsResult.result }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
	}

	const { result } = ogsResult;

	const firstImage = result.ogImage?.[0];

	if (isNil(firstImage)) {
		return json({}, { status: HttpStatus.INTERNAL_SERVER_ERROR });
	}

	return json({ image: firstImage } satisfies OpenGraphScraperResponse, {
		status: HttpStatus.OK
	});
}
