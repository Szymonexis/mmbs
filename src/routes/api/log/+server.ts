import { HttpStatus } from '$shared/http-status.js';
import { validateBody } from '$shared/server/validate-body';

import { json } from '@sveltejs/kit';

import { LogRequest } from './model';
import { sql } from '$shared/server/database';

export async function POST(event) {
	const ip = event.getClientAddress();

	const body = await event.request.json();
	const validationResult = await validateBody(body, LogRequest);
	if (validationResult.type === 'error') {
		return validationResult.response;
	}

	const { route, type, userAgent } = validationResult.dto;

	await sql`
    INSERT INTO "Visit" (
      "date", "ipAddress", "route", "type", "userAgent"
    ) VALUES (
      ${new Date()}, ${ip}, ${route}, ${type}, ${userAgent}
    );
  `;

	return json({}, { status: HttpStatus.OK });
}
