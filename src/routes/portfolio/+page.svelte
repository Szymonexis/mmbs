<script lang="ts">
	import {
		getCompletePortfolioItems,
		LABEL_TO_PROPERTY_MAP,
		type PortfolioItem,
		type PortfolioKey
	} from './model';
	import { getOgImage } from './portfolio.remote';
	import { currentLocale, t } from '$i18n';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const PAGE_SIZE = 10;

	let portfolioList = $state<PortfolioItem[]>(getCompletePortfolioItems());
	let openedIndex: number | null = $state(null);
	let currentPage = $state(1);

	// mediaList exists only on some projects, hence the cast.
	function getMediaLabel(key: PortfolioKey, label: string): string {
		const project = $t.portfolio.projects[key] as { mediaList?: Record<string, string> };
		return project.mediaList?.[label] ?? label;
	}

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
	<title>{$t.meta.portfolio.title}</title>
	<meta name="description" content={$t.meta.portfolio.description} />
</svelte:head>

<div class="my-6">
	{#each pagedList as portfolioItem, index (index)}
		{@const project = $t.portfolio.projects[portfolioItem.key]}
		<div
			class="flex items-start gap-6 max-[52rem]:flex-col"
			class:flex-row={index % 2 === 0}
			class:flex-row-reverse={index % 2 === 1}
		>
			{#if portfolioItem.ogImageReplacement}
				<img
					src={portfolioItem.ogImageReplacement}
					alt="Placeholder"
					class="aspect-video rounded-xl bg-gray-200 object-cover max-[52rem]:min-h-60 min-[52rem]:h-60"
					loading="lazy"
				/>
			{:else}
				<svelte:boundary>
					{#snippet pending()}
						<div
							aria-hidden="true"
							class="aspect-video animate-pulse rounded-xl bg-gray-200 object-cover select-none max-[52rem]:min-h-60 min-[52rem]:h-60"
						></div>
					{/snippet}

					{#snippet failed()}
						<img
							src="https://placehold.co/1600x900?font=roboto&text=No%20Image%20Found"
							alt="Placeholder"
							class="aspect-video rounded-xl bg-gray-200 object-cover max-[52rem]:min-h-60 min-[52rem]:h-60"
							loading="lazy"
						/>
					{/snippet}

					<img
						src={(await getOgImage(portfolioItem.url))?.url ??
							'https://placehold.co/1600x900?font=roboto&text=No%20Image%20Found'}
						alt={(await getOgImage(portfolioItem.url))?.alt ?? 'Placeholder'}
						class="aspect-video rounded-xl bg-gray-200 object-cover max-[52rem]:min-h-60 min-[52rem]:h-60"
						loading="lazy"
					/>
				</svelte:boundary>
			{/if}

			<div class="flex-auto">
				<h1 class="unbounded mb-4 text-4xl text-blue-800">
					{project.title}
				</h1>

				<div class="mb-4">
					{project.shortDescription}
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
						{@html $t.portfolio.dates.label({
							fromDate: portfolioItem.startDate.toLocaleDateString($currentLocale, {
								month: 'numeric',
								year: 'numeric'
							}),
							toDate:
								portfolioItem.endDate === 'now'
									? $t.portfolio.dates.now
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
							{$t.portfolio.label[LABEL_TO_PROPERTY_MAP[label].key]}
						</span>
					{/each}
				</div>

				{#if project.description.length > 0}
					<button
						class="mt-4 cursor-pointer rounded-md bg-blue-800 px-4 py-2 text-center font-bold text-white"
						onclick={() => onOpenFullDescription(index)}
					>
						{openedIndex === index ? $t.portfolio.readLess : $t.portfolio.readMore}
					</button>
				{/if}
			</div>
		</div>

		{#if openedIndex === index}
			<div class="mt-4" transition:slide={{ duration: 500, easing: quintOut }}>
				<div class="flex flex-col gap-4 rounded-lg border-2 border-blue-800 p-4">
					{#each project.description as part, partIndex (partIndex)}
						<p>{part}</p>
					{/each}

					{#if portfolioItem.mediaList.length > 0}
						<span class="text-lg font-bold text-blue-800">
							{$t.portfolio.relatedAssets}:
						</span>

						{#each portfolioItem.mediaList as { url, label }, mediaIndex (mediaIndex)}
							<span class="decoration-black decoration-2 hover:underline">
								<i class="fa-solid fa-link"></i>
								<a href={url} target="_blank">{getMediaLabel(portfolioItem.key, label)}</a>
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
				{$t.portfolio.pagination.previous}
			</button>

			<span class="text-sm">
				{@html $t.portfolio.pagination.page({ current: currentPage, total: totalPages })}
			</span>

			<button
				class="cursor-pointer rounded-md px-4 py-2 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
				class:bg-blue-800={currentPage < totalPages}
				class:text-white={currentPage < totalPages}
				class:bg-gray-200={currentPage >= totalPages}
				disabled={currentPage >= totalPages}
				onclick={() => goToPage(currentPage + 1)}
			>
				{$t.portfolio.pagination.next}
			</button>
		</div>
	{/if}
</div>
