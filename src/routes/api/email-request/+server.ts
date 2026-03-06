import { createTransport } from 'nodemailer';
import { json } from '@sveltejs/kit';
import { EMAIL_PASSWORD, EMAIL_RECIEVER, EMAIL_SENDER } from '$env/static/private';
import { getEmailRequestContent } from '$shared/get-email-request-content';
import { validateBody } from '$shared/server/validate-body.js';
import { createAssessment } from '$shared/server/grecaptcha';
import { ContactFormRequest } from './model';
import { HttpStatus } from '$shared/http-status';
import { RecaptchaAction } from '$shared/recaptcha-action';

export async function POST({ request }) {
	const body = await request.json();

	const validationResult = await validateBody(body, ContactFormRequest);
	if (validationResult.type === 'error') {
		return validationResult.response;
	}

	const { dto } = validationResult;

	let score: number | null = null;
	try {
		score = await createAssessment({
			token: dto.reCaptchaToken,
			recaptchaAction: RecaptchaAction.CONTACT_FORM_REQUEST
		});
	} catch (error) {
		console.error('reCAPTCHA assessment failed:', error);
		return json({ message: 'recaptcha assessment failed' }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
	}

	if (score === null || score <= 0.5) {
		return json({ message: 'recaptcha' }, { status: HttpStatus.FORBIDDEN });
	}

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
