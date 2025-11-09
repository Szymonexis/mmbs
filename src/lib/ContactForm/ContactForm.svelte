<script lang="ts">
	import { translate } from '$i18n';
	import { createForm } from 'svelte-forms-lib';
	import { FORM_FIELDS, SCHEMA, type ContactFormValue } from './model';
	import { isEmpty, isNil } from 'lodash-es';
	import { onDestroy } from 'svelte';
	import { getDefaultHeaders } from '$shared/get-default-headers';

	let isValid = $state(false);
	let isLoading = $state(false);

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
			isLoading = true;
			await fetch('/api/email-request', {
				method: 'POST',
				headers: getDefaultHeaders(),
				body: JSON.stringify(value)
			});
			isLoading = false;

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

<form
	class="h-min w-full min-w-80 rounded-md border-2 border-blue-800 px-8 py-6 shadow-md"
	onsubmit={handleSubmit}
>
	<span class="unbounded text-2xl text-blue-800 max-sm:text-xl">
		{$translate('contactForm.title')}
	</span>

	{#each FORM_FIELDS as { key, type }, i (i)}
		{#if type === 'input'}
			<div class="relative my-6">
				<input
					id={key}
					name={key}
					type="text"
					required
					placeholder={$translate(`contactForm.form.${key}.placeholder`)}
					bind:value={$form[key]}
					onchange={handleChange}
					onblur={handleChange}
					class="peer bg-light w-full border-0 border-b-2 border-blue-800 placeholder-transparent focus:border-blue-600 focus:ring-0"
				/>

				<label
					for={key}
					class="absolute -top-3.5 left-0 text-sm text-gray-600 transition-all
                       peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                       peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-800"
				>
					{$translate(`contactForm.form.${key}.label`)}
				</label>

				{#if $errors[key] !== ''}
					<small class="text-red-500">
						{$translate($errors[key])}
					</small>
				{/if}
			</div>
		{:else if type === 'textarea'}
			<div class="relative my-6">
				<textarea
					id={key}
					name={key}
					rows="5"
					required
					placeholder={$translate(`contactForm.form.${key}.placeholder`)}
					bind:value={$form[key]}
					onchange={handleChange}
					onblur={handleChange}
					class="peer bg-light w-full resize-none border-0 border-b-2 border-blue-800 placeholder-transparent focus:border-blue-600 focus:ring-0"
				></textarea>

				<label
					for={key}
					class="absolute -top-3.5 left-0 text-sm text-gray-600 transition-all
                       peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                       peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-800"
				>
					{$translate(`contactForm.form.${key}.label`)}
				</label>

				{#if $errors[key] !== ''}
					<small class="text-red-500">
						{$translate($errors[key])}
					</small>
				{/if}
			</div>
		{/if}
	{/each}

	<div class="flex">
		<span class="flex-auto"></span>

		<button
			class="unbounded flex items-center text-lg text-blue-800"
			class:grayscale={!isValid}
			class:cursor-not-allowed={!isValid || isLoading}
			class:cursor-pointer={isValid && !isLoading}
			type="submit"
			disabled={!isValid || isLoading}
		>
			{#if isLoading}
				<div
					class="mr-2 h-16 w-16 animate-spin rounded-full border-8 border-blue-800 border-t-transparent"
				></div>
			{:else}
				<span>{$translate('contactForm.button')}</span>
				<img
					class="aspect-square w-16 object-contain"
					src="/contact-form/send.webp"
					alt="contact form send icon"
					loading="lazy"
					fetchpriority="low"
				/>
			{/if}
		</button>
	</div>
</form>
