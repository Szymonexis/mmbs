<script lang="ts">
	import { translate } from '$i18n';
	import { createForm } from 'svelte-forms-lib';
	import { SCHEMA, type ContactFormValue } from './model';
	import { isEmpty, isNil } from 'lodash-es';
	import { onDestroy } from 'svelte';
	import { getDefaultHeaders } from '$shared/get-default-headers';

	let isValid = $state(false);

	const formInitialValue: ContactFormValue = {
		name: '',
		companyName: '',
		email: '',
		phone: '',
		message: ''
	};

	const {
		form,
		errors,
		touched,
		state: formState,
		handleChange,
		handleSubmit
	} = createForm({
		initialValues: formInitialValue,
		validationSchema: SCHEMA,
		onSubmit: async function (value) {
			await fetch('/api/email-request', {
				method: 'POST',
				headers: getDefaultHeaders(),
				body: JSON.stringify(value)
			});

			form.set(formInitialValue);
			touched.set({} as any);
			errors.set({} as any);
		}
	});

	const unsub = formState.subscribe(({ errors, form, ...formState }) => {
		const hasErrors = Object.values(errors).some((error) => !isEmpty(error));
		const hasMissingValues = Object.values(form).some((value) => isEmpty(value) || isNil(value));

		isValid = formState.isValid && !hasMissingValues && !hasErrors;
	});

	onDestroy(() => {
		unsub();
	});
</script>

<form class="h-min rounded-md border-2 border-blue-800 px-8 py-6" onsubmit={handleSubmit}>
	<span class="unbounded text-2xl text-blue-800">
		{$translate('contactForm.title')}
	</span>

	<!-- name -->
	<div class="my-4 flex flex-col gap-2">
		<input
			class="bg-light border-0 border-b-2 border-blue-800 focus:ring-0"
			type="text"
			name="name"
			placeholder={$translate('contactForm.form.name.placeholder')}
			required
			onchange={handleChange}
			onblur={handleChange}
			bind:value={$form.name}
		/>

		{#if $errors.name !== ''}
			<small class="text-red-500">
				{$translate($errors.name)}
			</small>
		{/if}
	</div>

	<!-- companyName -->
	<div class="my-4 flex flex-col gap-2">
		<input
			class="bg-light border-0 border-b-2 border-blue-800 focus:ring-0"
			type="text"
			name="companyName"
			placeholder={$translate('contactForm.form.companyName.placeholder')}
			required
			onchange={handleChange}
			onblur={handleChange}
			bind:value={$form.companyName}
		/>

		{#if $errors.companyName !== ''}
			<small class="text-red-500">
				{$translate($errors.companyName)}
			</small>
		{/if}
	</div>

	<!-- email -->
	<div class="my-4 flex flex-col gap-2">
		<input
			class="bg-light border-0 border-b-2 border-blue-800 focus:ring-0"
			type="email"
			name="email"
			placeholder={$translate('contactForm.form.email.placeholder')}
			required
			onchange={handleChange}
			onblur={handleChange}
			bind:value={$form.email}
		/>

		{#if $errors.email !== ''}
			<small class="text-red-500">
				{$translate($errors.email)}
			</small>
		{/if}
	</div>

	<!-- phone -->
	<div class="my-4 flex flex-col gap-2">
		<input
			class="bg-light border-0 border-b-2 border-blue-800 focus:ring-0"
			type="tel"
			name="phone"
			placeholder={$translate('contactForm.form.phone.placeholder')}
			required
			onchange={handleChange}
			onblur={handleChange}
			bind:value={$form.phone}
		/>

		{#if $errors.phone !== ''}
			<small class="text-red-500">
				{$translate($errors.phone)}
			</small>
		{/if}
	</div>

	<!-- message -->
	<div class="my-4 flex flex-col gap-2">
		<textarea
			class="bg-light w-full resize-none overflow-auto border-0 border-b-2 border-blue-800 focus:ring-0"
			rows="5"
			name="message"
			placeholder={$translate('contactForm.form.message.placeholder')}
			required
			onchange={handleChange}
			onblur={handleChange}
			bind:value={$form.message}
		></textarea>

		{#if $errors.message !== ''}
			<small class="text-red-500">
				{$translate($errors.message)}
			</small>
		{/if}
	</div>

	<div class="flex">
		<span class="flex-auto"></span>

		<button
			class="unbounded flex items-center text-lg text-blue-800"
			class:grayscale={!isValid}
			class:cursor-not-allowed={!isValid}
			class:cursor-pointer={isValid}
			type="submit"
		>
			{$translate('contactForm.button')}

			<img
				class="aspect-square w-16 object-contain"
				src="/contact-form/send.png"
				alt="contact form send icon"
			/>
		</button>
	</div>
</form>
