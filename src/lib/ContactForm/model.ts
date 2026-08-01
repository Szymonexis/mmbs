import * as yup from 'yup';

// Messages are dictionary error keys (contactForm.form.<field>.errors.*), resolved per locale in the component.
export const CONTACT_FORM_SCHEMA = yup.object().shape({
	name: yup.string().required('required'),
	companyName: yup.string().required('required'),
	email: yup.string().email('invalid').required('required'),
	phone: yup
		.string()
		.matches(/^[\d+\-\s]+$/, 'invalid')
		.required('required'),
	message: yup.string().required('required')
});

export type ContactFormValue = yup.InferType<typeof CONTACT_FORM_SCHEMA>;

export const CONTACT_FORM_FIELDS: {
	key: keyof ContactFormValue;
	type: 'input' | 'textarea';
}[] = [
	{
		key: 'name',
		type: 'input'
	},
	{
		key: 'companyName',
		type: 'input'
	},
	{
		key: 'email',
		type: 'input'
	},
	{
		key: 'phone',
		type: 'input'
	},
	{
		key: 'message',
		type: 'input'
	}
];
