<script lang="ts">
	import {
		getCompletePortfolioItems,
		LABEL_TO_PROPERTY_MAP,
		type PortfolioItem,
		type PortfolioKey
	} from './model';
	import ProjectImage from './ProjectImage.svelte';
	import { currentLocale, t } from '$i18n';
	import { PageMeta } from '$lib';
	import { onMount, tick } from 'svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const PAGE_SIZE = 10;
	const IMAGE_CLASS =
		'aspect-video rounded-xl bg-gray-200 object-cover max-[52rem]:min-h-60 min-[52rem]:h-60';

	let portfolioList = $state<PortfolioItem[]>(getCompletePortfolioItems());
	let openedKey: PortfolioKey | null = $state(null);
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

	function onOpenFullDescription(key: PortfolioKey) {
		openedKey = openedKey === key ? null : key;
	}

	function goToPage(page: number) {
		currentPage = page;
		openedKey = null;
	}

	async function openLinkedProject() {
		const linkedIndex = portfolioList.findIndex(({ key }) => key === location.hash.slice(1));

		if (linkedIndex === -1) {
			return;
		}

		const { key } = portfolioList[linkedIndex];

		currentPage = Math.floor(linkedIndex / PAGE_SIZE) + 1;
		openedKey = $t.portfolio.projects[key].description.length > 0 ? key : null;

		await tick();
		document.getElementById(key)?.scrollIntoView();
	}

	onMount(openLinkedProject);
</script>

<PageMeta page="portfolio" />

<div class="my-6">
	<h1 class="sr-only">{$t.header.portfolio}</h1>

	{#each pagedList as portfolioItem, index (portfolioItem.key)}
		{@const project = $t.portfolio.projects[portfolioItem.key]}
		<div
			id={portfolioItem.key}
			class="flex scroll-mt-30 items-start gap-6 max-[52rem]:flex-col"
			class:flex-row={index % 2 === 0}
			class:flex-row-reverse={index % 2 === 1}
		>
			<ProjectImage item={portfolioItem} class={IMAGE_CLASS} />

			<div class="flex-auto">
				<h2 class="unbounded mb-4 text-4xl text-blue-800">
					{project.title}
				</h2>

				<div class="mb-4">
					{project.shortDescription}
				</div>

				<div class="mb-2 decoration-blue-800 decoration-1 hover:underline">
					<i class="fa-solid fa-link text-blue-800"></i>
					<a
						class="font-bold text-blue-800"
						href={portfolioItem.url}
						target="_blank"
						rel="external"
					>
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
						onclick={() => onOpenFullDescription(portfolioItem.key)}
					>
						{openedKey === portfolioItem.key ? $t.portfolio.readLess : $t.portfolio.readMore}
					</button>
				{/if}
			</div>
		</div>

		{#if openedKey === portfolioItem.key}
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
								<a href={url} target="_blank" rel="external"
									>{getMediaLabel(portfolioItem.key, label)}</a
								>
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
