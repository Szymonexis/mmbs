import type { ContactFormValue } from '$lib/ContactForm/model';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class ContactFormRequest implements ContactFormValue {
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
