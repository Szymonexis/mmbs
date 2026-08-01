<script lang="ts">
	import { currentLocale, Locale, LOCALES_MAP } from '$i18n';

	let isOpen = $state(false);
	let container: HTMLDivElement;

	function choose(locale: Locale) {
		currentLocale.set(locale);
		isOpen = false;
	}

	function onWindowClick(event: MouseEvent) {
		if (container && !container.contains(event.target as Node)) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={onWindowClick} />

<div class="relative" bind:this={container}>
	<button
		type="button"
		class="flex w-full items-center gap-2 rounded-md border-2 border-blue-800 px-3 py-1 text-blue-800"
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		onclick={() => (isOpen = !isOpen)}
	>
		<img
			class="h-4 w-6 rounded-xs object-cover ring-1 ring-gray-300"
			src={LOCALES_MAP[$currentLocale].flag}
			alt=""
		/>
		<span class="flex-auto text-left">{LOCALES_MAP[$currentLocale].label}</span>
		<i class="fa-solid fa-chevron-down text-xs" class:rotate-180={isOpen}></i>
	</button>

	{#if isOpen}
		<ul
			class="bg-light absolute right-0 z-1002 mt-1 w-full min-w-max overflow-hidden rounded-md border-2 border-blue-800"
			role="listbox"
		>
			{#each Object.values(Locale) as locale (locale)}
				<li>
					<button
						type="button"
						role="option"
						aria-selected={$currentLocale === locale}
						class="flex w-full items-center gap-2 px-3 py-1 text-left text-blue-800 hover:bg-blue-800 hover:text-white"
						class:bg-blue-800={$currentLocale === locale}
						class:text-white={$currentLocale === locale}
						onclick={() => choose(locale)}
					>
						<img
							class="h-4 w-6 rounded-xs object-cover ring-1 ring-gray-300"
							src={LOCALES_MAP[locale].flag}
							alt=""
						/>
						<span>{LOCALES_MAP[locale].label}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
