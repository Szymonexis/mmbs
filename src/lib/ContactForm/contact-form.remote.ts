import { IsDefined, IsEmail, IsString } from 'class-validator';
import { createTransport } from 'nodemailer';

import { command } from '$app/server';
import { error } from '@sveltejs/kit';
import { EMAIL_PASSWORD, EMAIL_RECIEVER, EMAIL_SENDER } from '$env/static/private';
import { getEmailRequestContent } from '$shared/get-email-request-content';
import { HttpStatus } from '$shared/http-status';
import { RecaptchaAction } from '$shared/recaptcha-action';
import { createAssessment } from '$shared/server/grecaptcha';
import { validateDto } from '$shared/server/validate-dto';

import type { ContactFormValue } from './model';

// Not exported on purpose — remote files may only export remote functions.
class ContactFormRequest implements ContactFormValue {
	@IsString()
	@IsDefined()
	declare name: string;

	@IsString()
	@IsDefined()
	declare companyName: string;

	@IsEmail()
	@IsDefined()
	declare email: string;

	@IsString()
	@IsDefined()
	declare message: string;

	@IsString()
	@IsDefined()
	declare phone: string;

	@IsString()
	@IsDefined()
	declare reCaptchaToken: string;
}

export const sendEmailRequest = command('unchecked', async (data: ContactFormRequest) => {
	const dto = await validateDto(data, ContactFormRequest);

	let score: number | null = null;
	try {
		score = await createAssessment({
			token: dto.reCaptchaToken,
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

	const { name, message, ...rest } = dto;

	await transporter.sendMail({
		from: EMAIL_SENDER,
		to: EMAIL_RECIEVER,
		subject: `[MMBS CLIENT MESSAGE] ${name}`,
		html: getEmailRequestContent(JSON.stringify({ name, ...rest }, null, 2), message)
	});
});
