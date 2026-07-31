import { command } from '$app/server';
import { EMAIL_PASSWORD, EMAIL_RECIEVER, EMAIL_SENDER } from '$env/static/private';
import { getEmailRequestContent } from '$shared/get-email-request-content';
import { HttpStatus } from '$shared/http-status';
import { RecaptchaAction } from '$shared/recaptcha-action';
import { createAssessment } from '$shared/server/grecaptcha';
import { omit } from 'lodash-es';
import { createTransport } from 'nodemailer';
import * as yup from 'yup';

import { error } from '@sveltejs/kit';

import { CONTACT_FORM_SCHEMA } from './model';

const sendEmailRequestSchema = CONTACT_FORM_SCHEMA.concat(
	yup.object().shape({
		reCaptchaToken: yup.string().required()
	})
);

export const sendEmailRequest = command(sendEmailRequestSchema, async (data) => {
	let score: number | null = null;
	try {
		score = await createAssessment({
			token: data.reCaptchaToken,
			recaptchaAction: RecaptchaAction.CONTACT_FORM_REQUEST
		});
	} catch (err) {
		console.error('reCAPTCHA assessment failed:', err);
		error(HttpStatus.INTERNAL_SERVER_ERROR, 'recaptcha assessment failed');
	}

	if (score === null || score <= 0.5) {
		error(HttpStatus.FORBIDDEN, 'recaptcha');
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

	const { name, message, ...rest } = omit(data, ['reCaptchaToken']);

	await transporter.sendMail({
		from: EMAIL_SENDER,
		to: EMAIL_RECIEVER,
		subject: `[MMBS CLIENT MESSAGE] ${name}`,
		html: getEmailRequestContent(JSON.stringify({ name, ...rest }, null, 2), message)
	});
});
