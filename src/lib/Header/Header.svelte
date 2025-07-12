<script lang="ts">
	import { currentLocale, Locale, LOCALES_MAP, translate } from '$i18n';
	import { page } from '$app/state';

	const headerItems = [
		{ label: 'aboutUs', href: '/' },
		{ label: 'services', href: '/services' },
		{ label: 'portfolio', href: '/portfolio' },
		{ label: 'faq', href: '/faq' }
	];

	function contantUsClick() {}
</script>

<div class="bg-light fixed flex h-24 w-full justify-center">
	<div class="flex h-full w-full max-w-7xl items-center gap-6 p-6">
		<img class="h-full object-contain" src="/other/mmbs-logo.png" alt="MMBS Logo" />

		<div class="flex-auto"></div>

		{#each headerItems as { href, label }}
			<a
				class="decoration-blue-800 decoration-1 underline-offset-4 hover:underline"
				class:underline={page.url.pathname === href}
				class:decoration-2={page.url.pathname === href}
				{href}
			>
				{$translate(`header.${label}`)}
			</a>
		{/each}

		<button
			class="cursor-pointer rounded-md bg-blue-800 px-4 py-2 font-bold text-white"
			onclick={contantUsClick}
		>
			{$translate('header.contactUs')}
		</button>

		<select class="w-fit rounded-md" bind:value={$currentLocale}>
			{#each Object.values(Locale) as locale}
				<option value={locale}>
					{$translate(LOCALES_MAP[locale].label)}
					{LOCALES_MAP[locale].flag}
				</option>
			{/each}
		</select>
	</div>
</div>
