<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { translate } from '$i18n';
	import { ContactForm } from '$lib';
	import { MEMBERS } from './model';
	import { onDestroyLog, onMountLog } from '$shared/browser/log-functions';

	const wordsCarouselItems = new Array(6).fill(0).map((_, i) => `home.hero.carousel.${i}`);
	const processItemPrefix = 'home.process.steps';
	const processItems = new Array(4).fill(0).map((_, i) => ({
		icon: `/home/process-${i}.webp`,
		index: `${i + 1}`,
		title: `${processItemPrefix}.${i}.title`,
		description: `${processItemPrefix}.${i}.description`
	}));

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
				}, 2000);
			}
		}, 150);
	}

	onMount(async () => {
		startCarousel();

		await onMountLog();
	});

	onDestroy(async () => {
		if (wordsCrouselIntervalId) clearInterval(wordsCrouselIntervalId);
		if (wrodsCarouselPauseTimeoutId) clearTimeout(wrodsCarouselPauseTimeoutId);

		await onDestroyLog();
	});
</script>

<div class="my-6 md:grid md:grid-cols-2">
	<div
		class="unbounded flex flex-col items-center justify-center text-center text-5xl leading-[135%] text-blue-800 max-sm:text-4xl"
	>
		<div>{$translate('home.hero.top')}</div>

		<div>
			{$translate(wordsCarouselItems[currentWordCarouselIndex])}
		</div>

		<div>{$translate('home.hero.bottom')}</div>
	</div>

	<img src="/home/hero.webp" alt="hero" width="535px" height="535px" />
</div>

<div class="my-12">
	<span class="unbounded text-4xl text-blue-800 max-sm:text-3xl"
		>{$translate('home.process.title')}</span
	>

	<hr class="mt-1 border-1 text-blue-800" />

	<div class="my-6 block grid-cols-[auto_1fr] gap-6 md:grid">
		<div>
			{#each processItems as { index, title, description, icon } (index)}
				<div class="my-6 flex items-center gap-4">
					<img
						class="aspect-square w-20 object-contain max-sm:hidden"
						src={icon}
						alt={$translate(title) + ' icon'}
						loading="lazy"
						fetchpriority="low"
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

						<p class="ml-2 max-sm:ml-0">
							{$translate(description)}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<section id="contactUs" aria-labelledby="contactUs-form" class="scroll-mt-30">
			<ContactForm />
		</section>
	</div>
</div>

<div class="my-12">
	<div>
		<div class="unbounded text-4xl text-blue-800 max-sm:text-3xl">
			{$translate('home.ourTeam.title')}
		</div>

		<hr class="mt-1 border-1 text-blue-800" />

		{#each MEMBERS as member, i (i)}
			<div
				class="my-6 flex items-stretch gap-6 max-sm:flex-col-reverse"
				class:flex-row={i % 2 === 0}
				class:flex-row-reverse={i % 2 === 1}
			>
				<div class="flex flex-auto flex-col gap-4">
					<div class="unbounded text-4xl text-blue-800 max-sm:text-3xl">
						{$translate(member.name)}
					</div>

					<div class="unbounded text-lg text-blue-800">
						{$translate(member.position)}
					</div>

					{#each member.descriptionParts as descriptionPart, index (index)}
						<p>{$translate(descriptionPart)}</p>
					{/each}

					<div class="flex gap-4">
						{#each member.links as { href, name, icon }, index (index)}
							<a class="cursor-pointer" {href} target="_blank">
								<img
									src={icon}
									alt={name}
									class="h-8 object-contain"
									loading="lazy"
									fetchpriority="low"
								/>
							</a>
						{/each}
					</div>
				</div>

				<img
					class="w-full rounded-md object-cover max-sm:max-h-60 sm:max-w-60"
					src={member.image}
					alt={$translate(member.name)}
					loading="lazy"
					fetchpriority="low"
				/>
			</div>
		{/each}
	</div>
</div>
