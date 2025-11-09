import { HttpStatus } from '$shared/http-status.js';
import { validateBody } from '$shared/server/validate-body';

import { json } from '@sveltejs/kit';

import { LogRequest } from './model';
import { DatabaseService } from '$shared/server/database';
import { ENVIRONMENT } from '$env/static/private';

export async function POST(event) {
	if (ENVIRONMENT === 'development') return json({}, { status: HttpStatus.OK });

	try {
		if (!DatabaseService.isReady()) {
			console.warn('Database not ready, skipping log');
			return json({}, { status: HttpStatus.OK });
		}

		const ip = event.getClientAddress();

		const body = await event.request.json();
		const validationResult = await validateBody(body, LogRequest);
		if (validationResult.type === 'error') {
			return validationResult.response;
		}

		const { route, type, userAgent } = validationResult.dto;
		const sql = DatabaseService.init().sql;

		await sql`
    INSERT INTO "Visit" (
      "date", "ipAddress", "route", "type", "userAgent"
    ) VALUES (
      ${new Date()}, ${ip}, ${route}, ${type}, ${userAgent}
    );
  `;

		return json({}, { status: HttpStatus.OK });
	} catch (error) {
		console.error('Error logging visit:', error);
		return json({ message: 'Internal Server Error' }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
	}
}
