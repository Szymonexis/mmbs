<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { translate } from '$i18n';
	import { ContactForm } from '$lib';
	import { FAQ_ITEMS, MEMBERS } from './model';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { isNil } from 'lodash-es';

	const wordsCarouselItems = new Array(6).fill(0).map((_, i) => `aboutUs.hero.carousel.${i}`);
	const processItemPrefix = 'aboutUs.process.steps';
	const processItems = new Array(4).fill(0).map((_, i) => ({
		icon: `/about-us/process-${i}.png`,
		index: `${i + 1}`,
		title: `${processItemPrefix}.${i}.title`,
		description: `${processItemPrefix}.${i}.description`
	}));

	let faqContainer: HTMLDivElement;
	let selectedFaqItemIndex: number | null = null;

	let currentWordCarouselIndex = 0;
	let wordsCarouselStopIndex = wordsCarouselItems.length - 1;

	let wordsCrouselIntervalId: ReturnType<typeof setInterval> | null = null;
	let wrodsCarouselPauseTimeoutId: ReturnType<typeof setTimeout> | null = null;

	function startCarousel() {
		wordsCrouselIntervalId = setInterval(() => {
			currentWordCarouselIndex = (currentWordCarouselIndex + 1) % wordsCarouselItems.length;

			if (currentWordCarouselIndex === wordsCarouselStopIndex) {
				clearInterval(wordsCrouselIntervalId!);
				wordsCrouselIntervalId = null;

				wrodsCarouselPauseTimeoutId = setTimeout(() => {
					wordsCarouselStopIndex--;
					if (wordsCarouselStopIndex < 0) {
						wordsCarouselStopIndex = wordsCarouselItems.length - 1;
					}
					startCarousel();
				}, 1500);
			}
		}, 150);
	}

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

	onMount(() => {
		startCarousel();
	});

	onDestroy(() => {
		if (wordsCrouselIntervalId) clearInterval(wordsCrouselIntervalId);
		if (wrodsCarouselPauseTimeoutId) clearTimeout(wrodsCarouselPauseTimeoutId);
	});
</script>

<svelte:window on:click={handleClickOutside} />

<div class="my-6 grid grid-cols-2">
	<div
		class="unbounded flex flex-col items-center justify-center text-center text-5xl leading-[135%] text-blue-800"
	>
		<div>{$translate('aboutUs.hero.top')}</div>

		<div>
			{$translate(wordsCarouselItems[currentWordCarouselIndex])}
		</div>

		<div>{$translate('aboutUs.hero.bottom')}</div>
	</div>

	<img src="/about-us/hero.png" alt="hero" />
</div>

<div class="my-12">
	<span class="unbounded text-4xl text-blue-800">{$translate('aboutUs.process.title')}</span>

	<hr class="mt-1 border-1 text-blue-800" />

	<div class="my-6 grid grid-cols-[1fr_auto] gap-6">
		<div>
			{#each processItems as { index, title, description, icon }}
				<div class="my-6 flex items-center gap-4">
					<img
						class="aspect-square w-20 object-contain"
						src={icon}
						alt={$translate(title) + ' icon'}
					/>

					<div class="flex flex-col gap-4">
						<div class="flex items-center gap-4 text-lg font-bold">
							<div
								class="flex aspect-square w-8 items-center justify-center rounded-full border-2 border-blue-800 text-blue-800"
							>
								{index}
							</div>
							{$translate(title)}
						</div>

						<p class="ml-4">
							{$translate(description)}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<ContactForm />
	</div>
</div>

<div class="my-12">
	<div>
		<div class="unbounded text-4xl text-blue-800">
			{$translate('aboutUs.ourTeam.title')}
		</div>

		<hr class="mt-1 border-1 text-blue-800" />

		{#each MEMBERS as member, i}
			<div
				class="my-6 flex items-stretch gap-6"
				class:flex-row={i % 2 === 0}
				class:flex-row-reverse={i % 2 === 1}
			>
				<div class="flex flex-auto flex-col gap-4">
					<div class="unbounded text-4xl text-blue-800">
						{$translate(member.name)}
					</div>

					<div class="unbounded text-lg text-blue-800">
						{$translate(member.position)}
					</div>

					{#each member.descriptionParts as descriptionPart}
						<p>{$translate(descriptionPart)}</p>
					{/each}
				</div>

				<img
					class="w-full max-w-60 rounded-md object-cover"
					src={member.image}
					alt={$translate(member.name)}
				/>
			</div>
		{/each}
	</div>
</div>

<div class="my-12">
	<div class="unbounded text-4xl text-blue-800">
		{$translate('aboutUs.faq.title')}
	</div>

	<hr class="mt-1 border-1 text-blue-800" />

	<div class="my-6 block lg:grid lg:grid-cols-[2fr_1.5fr] lg:gap-6">
		<div class="flex flex-auto flex-col gap-4" bind:this={faqContainer}>
			{#each FAQ_ITEMS as faqItem, i}
				<div class="w-full">
					<button
						on:click={() => toggleFaqItem(i)}
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

		<div class="flex items-center">
			<img
				class="hidden object-contain lg:block"
				src={$translate("aboutUs.faq.whyUsImage.src")}
				alt={$translate('aboutUs.faq.whyUsImage.alt')}
			/>
		</div>
	</div>
</div>
