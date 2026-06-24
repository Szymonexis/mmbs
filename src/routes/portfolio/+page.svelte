<script lang="ts">
	import { getCompletePortfolioItems, LABEL_TO_PROPERTY_MAP, type PortfolioItem } from './model';
	import { currentLocale, translate } from '$i18n';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const PAGE_SIZE = 10;

	let portfolioList = $state<PortfolioItem[]>(getCompletePortfolioItems());
	let openedIndex: number | null = $state(null);
	let currentPage = $state(1);

	let totalPages = $derived(Math.ceil(portfolioList.length / PAGE_SIZE));
	let pagedList = $derived(
		portfolioList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
	);

	function onOpenFullDescription(index: number) {
		openedIndex = openedIndex === index ? null : index;
	}

	function goToPage(page: number) {
		currentPage = page;
		openedIndex = null;
	}
</script>

<svelte:head>
	<title>{$translate('meta.portfolio.title')}</title>
	<meta name="description" content={$translate('meta.portfolio.description')} />
</svelte:head>

<div class="my-6">
	{#each pagedList as portfolioItem, index (index)}
		<div
			class="flex items-start gap-6 max-[52rem]:flex-col"
			class:flex-row={index % 2 === 0}
			class:flex-row-reverse={index % 2 === 1}
		>
			{#await portfolioItem.ogImagePromise}
				<div
					aria-hidden="true"
					class="aspect-video animate-pulse rounded-xl bg-gray-200 object-cover select-none max-[52rem]:min-h-60 min-[52rem]:h-60"
				></div>
			{:then ogImage}
				<img
					src={ogImage?.url ??
						portfolioItem.ogImageReplacement ??
						'https://placehold.co/1600x900?font=roboto&text=No%20Image%20Found'}
					alt={ogImage?.alt ?? 'Placeholder'}
					class="aspect-video rounded-xl bg-gray-200 object-cover max-[52rem]:min-h-60 min-[52rem]:h-60"
					loading="lazy"
				/>
			{/await}

			<div class="flex-auto">
				<h1 class="unbounded mb-4 text-4xl text-blue-800">
					{$translate(portfolioItem.title)}
				</h1>

				<div class="mb-4">
					{$translate(portfolioItem.shortDescription)}
				</div>

				<div class="mb-2 decoration-blue-800 decoration-1 hover:underline">
					<i class="fa-solid fa-link text-blue-800"></i>
					<a class="font-bold text-blue-800" href={portfolioItem.url} target="_blank">
						{portfolioItem.url}
					</a>
				</div>

				<div class="mb-2">
					<i class="fa-regular fa-calendar"></i>
					<span>
						{@html $translate('portfolio.dates.label', {
							fromDate: portfolioItem.startDate.toLocaleDateString($currentLocale, {
								month: 'numeric',
								year: 'numeric'
							}),
							toDate:
								portfolioItem.endDate === 'now'
									? $translate('portfolio.dates.now')
									: portfolioItem.endDate.toLocaleDateString($currentLocale, {
											month: 'numeric',
											year: 'numeric'
										})
						})}
					</span>
				</div>

				<div class="flex flex-wrap gap-2">
					{#each portfolioItem.labels as label, labelIndex (labelIndex)}
						<span
							class={`rounded-full px-3 py-1 text-sm text-white ${LABEL_TO_PROPERTY_MAP[label].backgroundClass}`}
						>
							{$translate(LABEL_TO_PROPERTY_MAP[label].text)}
						</span>
					{/each}
				</div>

				{#if portfolioItem.descriptionParts.length > 0}
					<button
						class="mt-4 cursor-pointer rounded-md bg-blue-800 px-4 py-2 text-center font-bold text-white"
						onclick={() => onOpenFullDescription(index)}
					>
						{openedIndex === index
							? $translate('portfolio.readLess')
							: $translate('portfolio.readMore')}
					</button>
				{/if}
			</div>
		</div>

		{#if openedIndex === index}
			<div class="mt-4" transition:slide={{ duration: 500, easing: quintOut }}>
				<div class="flex flex-col gap-4 rounded-lg border-2 border-blue-800 p-4">
					{#each portfolioItem.descriptionParts as part, partIndex (partIndex)}
						<p>{$translate(part)}</p>
					{/each}

					{#if portfolioItem.mediaList.length > 0}
						<span class="text-lg font-bold text-blue-800">
							{$translate('portfolio.relatedAssets')}:
						</span>

						{#each portfolioItem.mediaList as { url, label }, mediaIndex (mediaIndex)}
							<span class="decoration-black decoration-2 hover:underline">
								<i class="fa-solid fa-link"></i>
								<a href={url} target="_blank">{$translate(label)}</a>
							</span>
						{/each}
					{/if}
				</div>
			</div>
		{/if}

		{#if index < pagedList.length - 1}
			<div class="h-12"></div>
		{/if}
	{/each}

	{#if totalPages > 1}
		<div class="mt-12 flex items-center justify-center gap-4">
			<button
				class="cursor-pointer rounded-md px-4 py-2 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
				class:bg-blue-800={currentPage > 1}
				class:text-white={currentPage > 1}
				class:bg-gray-200={currentPage <= 1}
				disabled={currentPage <= 1}
				onclick={() => goToPage(currentPage - 1)}
			>
				{$translate('portfolio.pagination.previous')}
			</button>

			<span class="text-sm">
				{@html $translate('portfolio.pagination.page', {
					current: String(currentPage),
					total: String(totalPages)
				})}
			</span>

			<button
				class="cursor-pointer rounded-md px-4 py-2 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
				class:bg-blue-800={currentPage < totalPages}
				class:text-white={currentPage < totalPages}
				class:bg-gray-200={currentPage >= totalPages}
				disabled={currentPage >= totalPages}
				onclick={() => goToPage(currentPage + 1)}
			>
				{$translate('portfolio.pagination.next')}
			</button>
		</div>
	{/if}
</div>
