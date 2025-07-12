import { createTransport } from 'nodemailer';
import { json } from '@sveltejs/kit';
import { EMAIL_PASSWORD, EMAIL_SENDER } from '$env/static/private';
import type { ContactFormValue } from '$lib/ContactForm/model.js';
import { getEmailRequestContent } from '$shared/get-email-request-content';

export async function POST({ request }) {
	const reqBody = (await request.json()) as ContactFormValue;

	const transporter = createTransport({
		service: 'gmail',
		auth: {
			user: EMAIL_SENDER,
			pass: EMAIL_PASSWORD
		}
	});

	const { name, message, ...rest } = reqBody;

	await transporter.sendMail({
		to: EMAIL_SENDER,
		subject: `[INNOVIO CLIENT MESSAGE] ${name}`,
		html: getEmailRequestContent(JSON.stringify({ name, ...rest }), message)
	});

	return json({ status: 'ok' });
}
