<script lang="ts">
	import { translate } from '$i18n';
	import { onDestroy, onMount } from 'svelte';
	import { HOW_IT_WORKS_STEPS, SERVICE_CARDS } from './model';
	import { isNil } from 'lodash-es';

	let selectedIndex: number | null = $state(null);
	let fastIntervalCleared = $state(false);
	let timeoutRef: ReturnType<typeof setTimeout> | null = null;
	let fastIntervalRef: ReturnType<typeof setInterval> | null = null;
	let slowIntervalRef: ReturnType<typeof setInterval> | null = null;

	function toggleCardSelection(index: number) {
		selectedIndex = selectedIndex === index ? null : index;
	}

	function cardClick(index: number) {
		if (!isNil(timeoutRef)) clearTimeout(timeoutRef);
		if (!isNil(fastIntervalRef)) clearInterval(fastIntervalRef);
		if (!isNil(slowIntervalRef)) clearInterval(slowIntervalRef);

		toggleCardSelection(index);
	}

	$effect(() => {
		if (fastIntervalCleared) {
			slowIntervalRef = setInterval(() => {
				const nextIndex = isNil(selectedIndex) ? 0 : (selectedIndex + 1) % SERVICE_CARDS.length;
				toggleCardSelection(nextIndex);
			}, 2500);
		}
	});

	onMount(() => {
		timeoutRef = setTimeout(() => {
			toggleCardSelection(0);

			fastIntervalRef = setInterval(() => {
				const nextIndex = isNil(selectedIndex) ? 0 : (selectedIndex + 1) % SERVICE_CARDS.length;
				let markedForClear = false;
				if (selectedIndex === SERVICE_CARDS.length - 1) {
					markedForClear = true;
				}

				toggleCardSelection(nextIndex);

				if (markedForClear && !isNil(fastIntervalRef)) {
					clearInterval(fastIntervalRef);
					fastIntervalCleared = true;
				}
			}, 500);
		}, 250);
	});

	onDestroy(() => {
		if (!isNil(fastIntervalRef)) clearInterval(fastIntervalRef);
		if (!isNil(timeoutRef)) clearTimeout(timeoutRef);
		if (!isNil(slowIntervalRef)) clearInterval(slowIntervalRef);
	});
</script>

<svelte:head>
	<title>{$translate('meta.services.title')}</title>
	<meta name="description" content={$translate('meta.services.description')} />
</svelte:head>

<div class="my-6">
	<!-- Desktop/Tablet View -->
	<div class="flex flex-col items-center max-sm:hidden">
		<div
			class="mb-12 auto-rows-fr gap-6 max-lg:max-w-190 sm:grid sm:grid-cols-2 lg:grid-cols-3"
		>
			{#each SERVICE_CARDS as { title, description, image: { src, alt } }, index (index)}
				<button
					onclick={() => cardClick(index)}
					class="perspective relative block w-full border-none bg-transparent p-0 cursor-pointer text-left"
				>
					<!-- The "Sizer" Image: Defines the height of the button -->
					<img
						class="invisible block w-full aspect-square object-contain select-none"
						{src}
						alt=""
						aria-hidden="true"
						draggable="false"
					/>

					<!-- Flipping Container: Positioned absolutely to fill the space created by the sizer -->
					<div
						class="transform-style-preserve-3d absolute inset-0 h-full w-full duration-500"
						class:rotate-y-180={index === selectedIndex}
					>
						<!-- Front Side -->
						<div
							class="bg-light absolute inset-0 flex h-full w-full items-center justify-center rounded-lg border-4 border-blue-800 shadow-lg backface-hidden"
						>
							<img
								class="aspect-square w-full object-contain select-none"
								class:opacity-5={index === selectedIndex}
								{src}
								alt={$translate(alt)}
								draggable="false"
								fetchpriority="high"
							/>
						</div>

						<!-- Back Side -->
						<div
							class="absolute inset-0 flex h-full w-full rotate-y-180 items-center justify-center rounded-lg bg-blue-800 text-white shadow-lg backface-hidden"
						>
							<div class="p-6 text-center">
								<h2 class="unbounded mb-4 text-xl">{$translate(title)}</h2>
								<div class="text-md">{$translate(description)}</div>
							</div>
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Mobile View -->
	<div class="flex w-full flex-col gap-8 sm:hidden">
		{#each SERVICE_CARDS as { title, description, image: { src, alt } }, index (index)}
			<div
				class="flex items-center gap-4"
				class:flex-row={index % 2 === 0}
				class:flex-row-reverse={index % 2 === 1}
			>
				<img
					class="aspect-square h-full min-w-32 object-contain"
					{src}
					{alt}
					loading="lazy"
					fetchpriority="low"
				/>

				<div class="flex flex-col gap-4">
					<div class="unbounded text-xl text-blue-800">
						{$translate(title)}
					</div>

					<div class="text-md">
						{$translate(description)}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- How it works section -->
	<div class="my-12">
		<h1 class="unbounded my-12 text-center text-4xl text-blue-800 max-sm:text-3xl">
			{$translate('services.howItWorks.title')}
		</h1>

		<div class="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-12">
			{#each HOW_IT_WORKS_STEPS as { title, description }, index (index)}
				<div class="flex items-center gap-2">
					<div
						class="unbounded w-[1em] shrink-0 grow-0 basis-[1em] text-right text-7xl text-blue-800"
					>
						{index + 1}
					</div>

					<div>
						<div class="font-bold">
							{$translate(title)}
						</div>

						<div>
							{$translate(description)}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.perspective {
		perspective: 1000px;
	}

	.transform-style-preserve-3d {
		transform-style: preserve-3d;
		/* Critical for Firefox stability in 3D contexts */
		backface-visibility: hidden;
	}

	.rotate-y-180 {
		transform: rotateY(180deg);
	}

	.backface-hidden {
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	/* Removes default button spacing in Firefox */
	button::-moz-focus-inner {
		border: 0;
		padding: 0;
	}
</style>