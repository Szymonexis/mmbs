<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { Locale, currentLocale } from '$i18n';
	import { Footer, Header } from '$lib';
	import {
		readValueFromLocalStorage,
		LocalStorageKey,
		setValueInLocalStorage
	} from '$shared/browser/local-storage';
	import { onDestroy, onMount } from 'svelte';
	import '../app.css';
	import type { Unsubscriber } from 'svelte/store';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	// Vercel Speed Insights
	injectSpeedInsights();

	// Vercel Analytics
	injectAnalytics();

	let { children } = $props();

	const isFullscreenGame = $derived(page.route.id === '/cgol');

	const unsubs: Unsubscriber[] = [];

	// SvelteKit records the scroll position right after jumping to a hash and restores it a
	// moment later, so the site-wide smooth scroll would be rolled back to where it started.
	onNavigate(({ to }) => {
		if (!to?.url.hash) {
			return;
		}

		document.documentElement.style.scrollBehavior = 'auto';

		return () => {
			document.documentElement.style.scrollBehavior = '';
		};
	});

	function loadLocale() {
		const prevCurrentLocale = $currentLocale;
		const storedLocale = readValueFromLocalStorage(LocalStorageKey.LOCALE) as Locale | null;
		const userLanguage = Object.values(Locale).find((locale) => {
			return locale.split('-')[0] === navigator.language.split('-')[0];
		});

		currentLocale.set(storedLocale ?? userLanguage ?? prevCurrentLocale);

		unsubs.push(
			currentLocale.subscribe((value) => {
				setValueInLocalStorage(LocalStorageKey.LOCALE, value);
			})
		);
	}

	onMount(async () => {
		loadLocale();
	});

	onDestroy(() => {
		unsubs.forEach((unsub) => unsub());
	});
</script>

{#if isFullscreenGame}
	{@render children()}
{:else}
	<Header />

	<div class="content flex flex-col items-center p-6 pt-24 pb-0">
		<div class="w-full max-w-7xl">
			{@render children()}
		</div>
	</div>

	<Footer />
{/if}

<style lang="scss">
	/* TODO: Remember to change this value when footer height changes */
	.content {
		$minimalFooterSize: calc(var(--spacing) * 36 + var(--carousel-image-size));

		min-height: calc(100dvh - #{$minimalFooterSize});
	}
</style>
