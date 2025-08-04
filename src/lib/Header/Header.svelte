<script lang="ts">
	import { currentLocale, Locale, LOCALES_MAP, translate } from '$i18n';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const headerItems = [
		{ label: 'aboutUs', href: '/', inverted: false },
		{ label: 'services', href: '/services', inverted: false },
		// { label: 'portfolio', href: '/portfolio', inverted: false },
		{ label: 'faq', href: '/faq', inverted: false },
		{ label: 'contactUs', href: '/contact-us', inverted: true }
	];

	let windowWidth = $state(0);
	const MD_BREAKPOINT = 768;
	const IS_GT_MD = $derived(windowWidth >= MD_BREAKPOINT);

	let isMobileMenuOpen = $state(false);

	function onOpenMobileMenu() {
		isMobileMenuOpen = true;
	}

	function onCloseMobileMenu() {
		isMobileMenuOpen = false;
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

{#if !IS_GT_MD}
	<div
		class="fixed top-0 right-0 bottom-0 left-0 z-1001 h-dvh w-dvw backdrop-blur-lg"
		class:hidden={!isMobileMenuOpen}
	>
		<button
			class="absolute top-6 right-6"
			onclick={onCloseMobileMenu}
			aria-label="close mobile menu"
		>
			<i class="fa-2xl fa-solid fa-xmark text-blue-800"></i>
		</button>

		<div class="flex h-full flex-col items-center justify-center gap-6">
			{#each headerItems as { href, label, inverted }}
				{#if !inverted}
					<a
						class="decoration-blue-800 decoration-1 underline-offset-4 hover:underline"
						class:underline={page.url.pathname === href}
						class:decoration-2={page.url.pathname === href}
						onclick={() => {
							onCloseMobileMenu();
							goto(href);
						}}
						{href}
					>
						{$translate(`header.${label}`)}
					</a>
				{/if}

				{#if inverted}
					<a
						class="cursor-pointer rounded-md bg-blue-800 px-4 py-2 font-bold text-white decoration-1 underline-offset-4 hover:underline"
						class:underline={page.url.pathname === href}
						class:decoration-2={page.url.pathname === href}
						onclick={() => {
							onCloseMobileMenu();
							goto(href);
						}}
						{href}
					>
						{$translate('header.contactUs')}
					</a>
				{/if}
			{/each}

			<select class="w-fit rounded-md border-2 border-blue-800" bind:value={$currentLocale}>
				{#each Object.values(Locale) as locale}
					<option value={locale}>
						{$translate(LOCALES_MAP[locale].label)}
						{LOCALES_MAP[locale].flag}
					</option>
				{/each}
			</select>
		</div>
	</div>
{/if}

<div class="bg-light fixed z-1000 flex h-24 w-full justify-center shadow-md">
	<div class="flex h-full w-full max-w-7xl items-center gap-6 p-6">
		<img class="h-full object-contain" src="/other/mmbs-logo.png" alt="MMBS Logo" />

		<div class="flex-auto"></div>

		{#if !IS_GT_MD}
			<button onclick={onOpenMobileMenu} aria-label="open mobile menu">
				<i class="fa-xl fa-solid fa-bars text-blue-800"></i>
			</button>
		{/if}

		{#if IS_GT_MD}
			{#each headerItems as { href, label, inverted }}
				{#if !inverted}
					<a
						class="decoration-blue-800 decoration-1 underline-offset-4 hover:underline"
						class:underline={page.url.pathname === href}
						class:decoration-2={page.url.pathname === href}
						{href}
					>
						{$translate(`header.${label}`)}
					</a>
				{/if}

				{#if inverted}
					<a
						class="cursor-pointer rounded-md bg-blue-800 px-4 py-2 font-bold text-white decoration-1 underline-offset-4 hover:underline"
						class:underline={page.url.pathname === href}
						class:decoration-2={page.url.pathname === href}
						{href}
					>
						{$translate('header.contactUs')}
					</a>
				{/if}
			{/each}

			<select class="w-fit rounded-md border-2 border-blue-800" bind:value={$currentLocale}>
				{#each Object.values(Locale) as locale}
					<option value={locale}>
						{$translate(LOCALES_MAP[locale].label)}
						{LOCALES_MAP[locale].flag}
					</option>
				{/each}
			</select>
		{/if}
	</div>
</div>
