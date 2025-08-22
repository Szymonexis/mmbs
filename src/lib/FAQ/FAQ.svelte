<script lang="ts">
	import { translate } from '$i18n';
	import { isNil } from 'lodash-es';
	import { FAQ_ITEMS } from './model';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let { isStandalone = false }: { isStandalone?: boolean } = $props();

	let faqContainer: HTMLDivElement;
	let selectedFaqItemIndex = $state<number | null>(null);

	function toggleFaqItem(index: number) {
		selectedFaqItemIndex = selectedFaqItemIndex === index ? null : index;
	}

	function handleClickOutside(event: MouseEvent) {
		const { target } = event;
		if (isNil(target)) return;

		if (faqContainer && !faqContainer.contains(target as Node)) {
			selectedFaqItemIndex = null;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

{#if !isStandalone}
	<div class="unbounded text-4xl text-blue-800 max-sm:text-3xl">
		{$translate('aboutUs.faq.title')}
	</div>

	<hr class="mt-1 border-1 text-blue-800" />
{/if}

<div class={`my-6 block ${isStandalone || 'lg:grid lg:grid-cols-[2fr_1.5fr] lg:gap-6'}`}>
	<div class="flex flex-auto flex-col gap-4" bind:this={faqContainer}>
		{#each FAQ_ITEMS as faqItem, i}
			<div class="w-full">
				<button
					onclick={() => toggleFaqItem(i)}
					aria-expanded={selectedFaqItemIndex === i}
					aria-controls={`faq-answer-${i}`}
					class="w-full cursor-pointer rounded-md bg-blue-800 px-4 py-2 text-left text-lg font-bold text-white decoration-1 underline-offset-4 hover:underline"
					class:rounded-b-none={i === selectedFaqItemIndex}
					class:underline={i === selectedFaqItemIndex}
					class:decoration-2={i === selectedFaqItemIndex}
				>
					{$translate(faqItem.question)}
				</button>

				{#if selectedFaqItemIndex === i}
					<div
						transition:slide={{ duration: 300, easing: quintOut }}
						id={`faq-answer-${i}`}
						class="rounded-b-md border-2 border-blue-800 px-4 py-2"
					>
						{$translate(faqItem.answer)}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if !isStandalone}
		<div class="flex items-center">
			<img
				class="hidden object-contain lg:block"
				src={$translate('aboutUs.faq.whyUsImage.src')}
				alt={$translate('aboutUs.faq.whyUsImage.alt')}
			/>
		</div>
	{/if}
</div>
