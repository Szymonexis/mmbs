<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { resolve } from '$app/paths';
	import { t } from '$i18n';
	import { ContactForm, PageMeta } from '$lib';
	import { MEMBERS } from './model';
	import { getHomePortfolioItems } from './portfolio/model';
	import ProjectImage from './portfolio/ProjectImage.svelte';

	const homeProjects = getHomePortfolioItems();

	const wordsCarouselCount = $t.home.hero.carousel.length;

	let currentWordCarouselIndex = 0;
	let wordsCarouselStopIndex = wordsCarouselCount - 1;

	let wordsCrouselIntervalId: ReturnType<typeof setInterval> | null = null;
	let wordsCarouselPauseTimeoutId: ReturnType<typeof setTimeout> | null = null;

	function startCarousel() {
		wordsCrouselIntervalId = setInterval(() => {
			currentWordCarouselIndex = (currentWordCarouselIndex + 1) % wordsCarouselCount;

			if (currentWordCarouselIndex === wordsCarouselStopIndex) {
				clearInterval(wordsCrouselIntervalId!);
				wordsCrouselIntervalId = null;

				wordsCarouselPauseTimeoutId = setTimeout(() => {
					wordsCarouselStopIndex--;
					if (wordsCarouselStopIndex < 0) {
						wordsCarouselStopIndex = wordsCarouselCount - 1;
					}
					startCarousel();
				}, 2000);
			}
		}, 150);
	}

	onMount(() => {
		startCarousel();
	});

	onDestroy(() => {
		if (wordsCrouselIntervalId) clearInterval(wordsCrouselIntervalId);
		if (wordsCarouselPauseTimeoutId) clearTimeout(wordsCarouselPauseTimeoutId);
	});
</script>

<PageMeta page="home" />

<div class="my-6 md:grid md:grid-cols-2">
	<h1
		class="unbounded flex flex-col items-center justify-center text-center text-5xl leading-[135%] text-blue-800 max-sm:text-4xl"
	>
		<div>{$t.home.hero.top}</div>

		<div>
			{$t.home.hero.carousel[currentWordCarouselIndex]}
		</div>

		<div>{$t.home.hero.bottom}</div>
	</h1>

	<img src="/home/hero.webp" alt="hero" width="535px" height="535px" />
</div>

<div class="my-12">
	<h2 class="unbounded text-4xl text-blue-800 max-sm:text-3xl">
		{$t.home.ourProjects.title}
	</h2>

	<hr class="mt-1 border-1 text-blue-800" />

	<!-- 2.37fr: the featured tile spans two rows plus the gap, so only this ratio keeps its image at the 1200:630 of the small ones. -->
	<div class="my-6 grid grid-cols-2 gap-4 lg:grid-cols-[2.37fr_1fr_1fr]">
		{#each homeProjects as project, i (project.key)}
			{@const featured = i === 0}
			<a
				href={resolve(`/portfolio#${project.key}`)}
				class={[
					'group flex min-w-0 flex-col overflow-hidden rounded-xl border-2 border-blue-800 bg-white transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800',
					featured && 'col-span-2 lg:col-span-1 lg:row-span-2'
				]}
			>
				<div class="relative aspect-[1200/630] min-h-0 flex-auto overflow-hidden bg-gray-200">
					<ProjectImage
						item={project}
						alt=""
						class="absolute inset-0 h-full w-full bg-gray-200 object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
					/>
				</div>

				<h3
					class={[
						'unbounded px-4 py-3 text-blue-800',
						featured ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'
					]}
				>
					{$t.portfolio.projects[project.key].title}
				</h3>
			</a>
		{/each}
	</div>
</div>

<div class="my-12">
	<h2 class="unbounded text-4xl text-blue-800 max-sm:text-3xl">
		{$t.home.process.title}
	</h2>

	<hr class="mt-1 border-1 text-blue-800" />

	<div class="my-6 block grid-cols-[auto_1fr] gap-6 md:grid">
		<div>
			{#each $t.home.process.steps as { title, description }, i (i)}
				<div class="my-6 flex items-center gap-4">
					<img
						class="aspect-square w-20 object-contain max-sm:hidden"
						src={`/home/process-${i}.webp`}
						alt={title + ' icon'}
						loading="lazy"
						fetchpriority="low"
					/>

					<div class="flex flex-col gap-4">
						<div class="flex items-center gap-4 text-lg font-bold">
							<div
								class="flex aspect-square w-8 items-center justify-center rounded-full border-2 border-blue-800 text-blue-800"
							>
								{i + 1}
							</div>
							{title}
						</div>

						<p class="ml-2 max-sm:ml-0">
							{description}
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
		<h2 class="unbounded text-4xl text-blue-800 max-sm:text-3xl">
			{$t.home.ourTeam.title}
		</h2>

		<hr class="mt-1 border-1 text-blue-800" />

		{#each MEMBERS as member, i (i)}
			{@const memberText = $t.home.ourTeam.members[member.key]}
			<div
				class="my-6 flex items-stretch gap-6 max-sm:flex-col-reverse"
				class:flex-row={i % 2 === 0}
				class:flex-row-reverse={i % 2 === 1}
			>
				<div class="flex flex-auto flex-col gap-4">
					<h3 class="unbounded text-4xl text-blue-800 max-sm:text-3xl">
						{memberText.name}
					</h3>

					<div class="unbounded text-lg text-blue-800">
						{memberText.position}
					</div>

					{#each memberText.descriptionParts as descriptionPart, index (index)}
						<p>{descriptionPart}</p>
					{/each}

					<div class="flex gap-4">
						{#each member.links as { href, name, icon }, index (index)}
							<a class="cursor-pointer" {href} target="_blank" rel="external">
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
					class="w-full rounded-md object-cover max-sm:aspect-square sm:max-w-60"
					src={member.image}
					alt={memberText.name}
					loading="lazy"
					fetchpriority="low"
				/>
			</div>
		{/each}
	</div>
</div>
