import { createTransport } from 'nodemailer';
import { json } from '@sveltejs/kit';
import { EMAIL_PASSWORD, EMAIL_RECIEVER, EMAIL_SENDER } from '$env/static/private';
import { getEmailRequestContent } from '$shared/get-email-request-content';
import { validateBody } from '$shared/server/validate-body.js';
import { ContactFormRequest } from './model';
import { HttpStatus } from '$shared/http-status';

export async function POST({ request }) {
	const body = await request.json();

	const validationResult = await validateBody(body, ContactFormRequest);
	if (validationResult.type === 'error') {
		return validationResult.response;
	}

	const { dto } = validationResult;

	const transporter = createTransport({
		host: 'mail.mmbs.pl',
		port: 465,
		secure: true,
		auth: {
			user: EMAIL_SENDER,
			pass: EMAIL_PASSWORD
		}
	});

	const { name, message, ...rest } = dto;

	await transporter.sendMail({
		from: EMAIL_SENDER,
		to: EMAIL_RECIEVER,
		subject: `[MMBS CLIENT MESSAGE] ${name}`,
		html: getEmailRequestContent(JSON.stringify({ name, ...rest }, null, 2), message)
	});

	return json({}, { status: HttpStatus.OK });
}
