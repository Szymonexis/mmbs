<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getCompletePortfolioItems,
		LABEL_TEXT_MAP,
		PORTFOLIO_LENGTH,
		type PortfolioList
	} from './model';
	import { currentLocale, translate } from '$i18n';
	import { isNil } from 'lodash-es';

	const portfolioIndexList = Array.from({ length: PORTFOLIO_LENGTH }).map((_, i) => i);
	let portfolioList = $state<PortfolioList>([]);

	onMount(async () => {
		portfolioList = await getCompletePortfolioItems();
	});
</script>

<div class="my-6">
	{#each portfolioIndexList as index}
		<div
			class="mb-12 flex gap-6 max-[52rem]:flex-col"
			class:flex-row={index % 2 === 0}
			class:flex-row-reverse={index % 2 === 1}
		>
			{#if isNil(portfolioList?.[index])}
				<div
					aria-hidden="true"
					class="aspect-video animate-pulse rounded-xl bg-gray-200 object-cover select-none max-[52rem]:min-h-60 min-[52rem]:h-60"
				></div>

				<div class="flex-auto select-none" aria-hidden="true">
					<div class="mb-6">
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
								class="animate-pulse rounded-full bg-gray-200 px-4 py-2 font-bold text-transparent"
							>
								Label_Placeholder
							</span>
						{/each}
					</div>
				</div>
			{:else}
				<img
					src={portfolioList[index]?.ogImage?.url ??
						'https://placehold.co/1600x900?font=roboto&text=Placeholder'}
					alt={portfolioList[index]?.ogImage?.alt ?? 'Placeholder'}
					class="aspect-video rounded-xl bg-gray-200 object-cover max-[52rem]:min-h-60 min-[52rem]:h-60"
					loading="lazy"
				/>

				<div class="flex-auto">
					<div class="unbounded mb-6 text-4xl text-blue-800">
						{$translate(portfolioList[index].title)}
					</div>

					<div class="mb-4">
						{$translate(portfolioList[index].shortDescription)}
					</div>

					<div class="mb-2">
						<i class="fa-solid fa-link"></i>
						<a href={portfolioList[index].url} target="_blank">{portfolioList[index].url}</a>
					</div>

					<div class="mb-2">
						<i class="fa-regular fa-calendar"></i>
						<span>
							{portfolioList[index].date.toLocaleDateString($currentLocale, {
								day: '2-digit',
								month: 'short',
								year: 'numeric'
							})}
						</span>
					</div>

					<div class="flex flex-wrap gap-2">
						{#each portfolioList[index].labels as label}
							<span class="rounded-full bg-blue-800 px-4 py-2 font-bold text-white">
								{$translate(LABEL_TEXT_MAP[label])}
							</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
