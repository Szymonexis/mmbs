<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { translate } from '$i18n';
	import { ContactForm } from '$lib';

	const carouselItems = new Array(6).fill(0).map((_, i) => `aboutUs.hero.carousel.${i}`);
	const processItemPrefix = 'aboutUs.process.steps';
	const processItems = new Array(4).fill(0).map((_, i) => ({
		icon: `/about-us/process-${i}.png`,
		index: `${i + 1}`,
		title: `${processItemPrefix}.${i}.title`,
		description: `${processItemPrefix}.${i}.description`
	}));

	let currentIndex = 0;
	let stopIndex = carouselItems.length - 1;

	let intervalId: ReturnType<typeof setInterval> | null = null;
	let pauseTimeoutId: ReturnType<typeof setTimeout> | null = null;

	function startCarousel() {
		intervalId = setInterval(() => {
			currentIndex = (currentIndex + 1) % carouselItems.length;

			if (currentIndex === stopIndex) {
				clearInterval(intervalId!);
				intervalId = null;

				pauseTimeoutId = setTimeout(() => {
					stopIndex--;
					if (stopIndex < 0) {
						stopIndex = carouselItems.length - 1;
					}
					startCarousel();
				}, 1500);
			}
		}, 150);
	}

	onMount(() => {
		startCarousel();
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
		if (pauseTimeoutId) clearTimeout(pauseTimeoutId);
	});
</script>

<div class="my-6 grid grid-cols-2">
	<div
		class="unbounded flex flex-col items-center justify-center text-center text-5xl leading-[135%] text-blue-800"
	>
		<div>{$translate('aboutUs.hero.top')}</div>

		<div>
			{$translate(carouselItems[currentIndex])}
		</div>

		<div>{$translate('aboutUs.hero.bottom')}</div>
	</div>

	<img src="/about-us/hero.png" alt="hero" />
</div>

<div class="my-6 grid grid-cols-[1fr_auto] gap-6">
	<div>
		<span class="unbounded text-4xl text-blue-800">{$translate('aboutUs.process.title')}</span>

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
