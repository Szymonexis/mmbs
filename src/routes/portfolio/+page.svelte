<script lang="ts">
	import { onMount } from 'svelte';
	import { getCompletePortfolioItems, LABEL_TO_PROPERTY_MAP, type PortfolioList } from './model';
	import { currentLocale, translate } from '$i18n';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let portfolioList = $state<PortfolioList>([]);
	let openedIndex: number | null = $state(null);

	function onOpenFullDescription(index: number) {
		openedIndex = openedIndex === index ? null : index;
	}

	onMount(async () => {
		portfolioList = await getCompletePortfolioItems();
	});
</script>

<div class="my-6">
	{#each portfolioList as portfolioItem, index}
		<div
			class="flex items-center gap-6 max-[52rem]:flex-col"
			class:flex-row={index % 2 === 0}
			class:flex-row-reverse={index % 2 === 1}
		>
			{#await portfolioItem}
				<div
					aria-hidden="true"
					class="aspect-video animate-pulse rounded-xl bg-gray-200 object-cover select-none max-[52rem]:min-h-60 min-[52rem]:h-60"
				></div>

				<div class="flex-auto select-none" aria-hidden="true">
					<div class="mb-4">
						<span class="unbounded animate-pulse rounded-xl bg-gray-200 text-4xl text-transparent">
							Placeholder
						</span>
					</div>

					<div class="mb-4">
						<span class="animate-pulse rounded-xl bg-gray-200 text-transparent">
							Short Description Placeholder
						</span>
					</div>

					<div class="mb-2">
						<span class="animate-pulse rounded-xl bg-gray-200 text-transparent">
							Link Placeholder
						</span>
					</div>

					<div class="mb-2">
						<span class="animate-pulse rounded-xl bg-gray-200 text-transparent"> DD MMM YYYY </span>
					</div>

					<div class="flex flex-wrap gap-2">
						{#each Array.from({ length: 2 })}
							<span
								class="animate-pulse rounded-full bg-gray-200 px-3 py-1 text-sm text-transparent"
							>
								Label_Placeholder
							</span>
						{/each}
					</div>
				</div>
			{:then awaitedportfolioItem}
				<img
					src={awaitedportfolioItem?.ogImage?.url ??
						awaitedportfolioItem?.ogImageReplacement ??
						'https://placehold.co/1600x900?font=roboto&text=No%20Image%20Found'}
					alt={awaitedportfolioItem?.ogImage?.alt ?? 'Placeholder'}
					class="aspect-video rounded-xl bg-gray-200 object-cover max-[52rem]:min-h-60 min-[52rem]:h-60"
					loading="lazy"
				/>

				<div class="flex-auto">
					<div class="unbounded mb-4 text-4xl text-blue-800">
						{$translate(awaitedportfolioItem.title)}
					</div>

					<div class="mb-4">
						{$translate(awaitedportfolioItem.shortDescription)}
					</div>

					<div class="mb-2 decoration-blue-800 decoration-1 hover:underline">
						<i class="fa-solid fa-link text-blue-800"></i>
						<a class="font-bold text-blue-800" href={awaitedportfolioItem.url} target="_blank">
							{awaitedportfolioItem.url}
						</a>
					</div>

					<div class="mb-2">
						<i class="fa-regular fa-calendar"></i>
						<span>
							{awaitedportfolioItem.date.toLocaleDateString($currentLocale, {
								day: '2-digit',
								month: 'short',
								year: 'numeric'
							})}
						</span>
					</div>

					<div class="flex flex-wrap gap-2">
						{#each awaitedportfolioItem.labels as label}
							<span
								class={`rounded-full px-3 py-1 text-sm text-white ${LABEL_TO_PROPERTY_MAP[label].backgroundClass}`}
							>
								{$translate(LABEL_TO_PROPERTY_MAP[label].text)}
							</span>
						{/each}
					</div>

					{#if awaitedportfolioItem.descriptionParts.length > 0}
						<button
							class="my-4 cursor-pointer rounded-md bg-blue-800 px-4 py-2 text-center font-bold text-white"
							onclick={() => onOpenFullDescription(index)}
						>
							{openedIndex === index
								? $translate('portfolio.readLess')
								: $translate('portfolio.readMore')}
						</button>
					{/if}
				</div>
			{/await}
		</div>

		{#await portfolioItem then { descriptionParts, mediaList }}
			{#if openedIndex === index}
				<div class="mt-4" transition:slide={{ duration: 300, easing: quintOut }}>
					<div class="flex flex-col gap-4 rounded-lg border-2 border-blue-800 p-4">
						{#each descriptionParts as part}
							<p>{$translate(part)}</p>
						{/each}

						{#if mediaList.length > 0}
							<span class="text-lg font-bold text-blue-800">
								{$translate('portfolio.relatedAssets')}:
							</span>

							{#each mediaList as { url, label }}
								<span class="decoration-black decoration-2 hover:underline">
									<i class="fa-solid fa-link"></i>
									<a href={url} target="_blank">{$translate(label)}</a>
								</span>
							{/each}
						{/if}
					</div>
				</div>
			{/if}
		{/await}

		{#if index < portfolioList.length - 1}
			<div class="my-12"></div>
		{/if}
	{/each}
</div>
