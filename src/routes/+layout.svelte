<script lang="ts">
	import { Locale, currentLocale } from '$i18n';
	import { Footer, Header } from '$lib';
	import {
		readValueFromLocalStorage,
		LocalStorageKey,
		setValueInLocalStorage
	} from '$shared/local-storage';
	import { onDestroy, onMount } from 'svelte';
	import '../app.css';
	import type { Unsubscriber } from 'svelte/store';

	let { children } = $props();

	const unsubs: Unsubscriber[] = [];

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

<Header />

<div class="content flex flex-col items-center p-6 pt-24 pb-0">
	<div class="w-full max-w-7xl">
		{@render children()}
	</div>
</div>

<Footer />

<style lang="css">
	.content {
		min-height: calc(100dvh - var(--spacing) * 36 - var(--carousel-image-size));
	}
</style>
