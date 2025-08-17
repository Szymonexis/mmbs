import type { ContactFormValue } from '$lib/ContactForm/model';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class ContactFormRequest implements ContactFormValue {
	@IsString()
	@IsDefined()
	name: string;

	@IsString()
	@IsDefined()
	companyName: string;

	@IsEmail()
	@IsDefined()
	email: string;

	@IsString()
	@IsDefined()
	message: string;

	@IsString()
	@IsDefined()
	phone: string;
}
