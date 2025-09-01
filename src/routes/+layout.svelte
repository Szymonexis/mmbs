<script lang="ts">
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
	import { page } from '$app/state';
	import { LogRequest, LogType } from '$api/log/model';

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

	function unloadLog() {
		const fn = function () {
			const body: LogRequest = {
				route: page.url.toString(),
				type: LogType.UNLOAD,
				userAgent: navigator.userAgent
			};
			navigator.sendBeacon('/api/log', JSON.stringify(body));
			window.removeEventListener('unload', fn);
		};

		window.addEventListener('unload', fn);
	}

	onMount(async () => {
		loadLocale();
		unloadLog();
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

<style lang="scss">
	/* TODO: Remember to change this value when footer height changes */
	.content {
		$minimalFooterSize: calc(var(--spacing) * 36 + var(--carousel-image-size));

		min-height: calc(100dvh - #{$minimalFooterSize});
	}
</style>
