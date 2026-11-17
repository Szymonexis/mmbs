<script lang="ts">
	import { MISSING_IMAGE_URL, type PortfolioItem } from './model';
	import { getOgImage } from './portfolio.remote';

	let {
		item,
		alt,
		class: className
	}: { item: PortfolioItem; alt?: string; class?: string } = $props();
</script>

{#if item.ogImageReplacement}
	<img src={item.ogImageReplacement} alt={alt ?? 'Placeholder'} class={className} loading="lazy" />
{:else}
	<svelte:boundary>
		{#snippet pending()}
			<div aria-hidden="true" class={['animate-pulse select-none', className]}></div>
		{/snippet}

		{#snippet failed()}
			<img src={MISSING_IMAGE_URL} alt={alt ?? 'Placeholder'} class={className} loading="lazy" />
		{/snippet}

		<img
			src={(await getOgImage(item.url))?.url ?? MISSING_IMAGE_URL}
			alt={alt ?? (await getOgImage(item.url))?.alt ?? 'Placeholder'}
			class={className}
			loading="lazy"
		/>
	</svelte:boundary>
{/if}
