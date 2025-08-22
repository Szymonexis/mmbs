<script lang="ts">
	import { translate } from '$i18n';
	import { onDestroy } from 'svelte';
	import { HOW_IT_WORKS_STEPS, SERVICE_CARDS } from './model';
	import { isNil } from 'lodash-es';

	let selectedIndex: number | null = $state(null);
	let timeoutRef: NodeJS.Timeout | null = null;
	let intervalRef: NodeJS.Timeout | null = null;

	function toggleCardSelection(index: number) {
		selectedIndex = selectedIndex === index ? null : index;
	}

	function cardClick(index: number) {
		if (!isNil(intervalRef)) {
			clearInterval(intervalRef);
		}

		toggleCardSelection(index);
	}

	timeoutRef = setTimeout(() => {
		toggleCardSelection(0);

		intervalRef = setInterval(() => {
			const nextIndex = isNil(selectedIndex) ? 0 : (selectedIndex + 1) % SERVICE_CARDS.length;
			toggleCardSelection(nextIndex);
		}, 2000);
	}, 1000);

	onDestroy(() => {
		if (!isNil(intervalRef)) clearInterval(intervalRef);
		if (!isNil(timeoutRef)) clearTimeout(timeoutRef);
	});
</script>

<div class="my-6">
	<!-- bigger than or equal to sm -->
	<div class="flex flex-col items-center max-sm:hidden">
		<div
			class="mb-12 auto-rows-fr gap-6 max-lg:max-w-190 max-sm:flex max-sm:flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3"
		>
			{#each SERVICE_CARDS as { title, description, image: { src, alt } }, index}
				<button
					onclick={() => cardClick(index)}
					class="perspective aspect-square h-full w-full cursor-pointer"
				>
					<img
						class="invisible aspect-square w-full object-contain select-none"
						class:opacity-5={index === selectedIndex}
						{src}
						alt={$translate(alt)}
						draggable="false"
						fetchpriority="high"
					/>

					<div
						class="transform-style-preserve-3d relative aspect-square h-full w-full -translate-y-full duration-500"
						class:rotate-y-180={index === selectedIndex}
					>
						<div
							class="bg-light absolute flex h-full w-full items-center justify-center rounded-lg border-4 border-blue-800 shadow-lg backface-hidden"
						>
							<img
								class="aspect-square w-full object-contain select-none"
								{src}
								alt={$translate(alt)}
								draggable="false"
								fetchpriority="high"
							/>
						</div>

						<div
							class="absolute flex h-full w-full rotate-y-180 items-center justify-center rounded-lg bg-blue-800 text-white shadow-lg backface-hidden"
						>
							<div class="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
								<div class="p-6 text-center">
									<div class="unbounded mb-4 text-xl">{$translate(title)}</div>

									<div class="text-md">{$translate(description)}</div>
								</div>
							</div>
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- smaller than sm -->
	<div class="flex w-full flex-col gap-8 sm:hidden">
		{#each SERVICE_CARDS as { title, description, image: { src, alt } }, index}
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

	<div class="my-12">
		<div class="unbounded my-12 text-center text-4xl text-blue-800 max-sm:text-3xl">
			{$translate('services.howItWorks.title')}
		</div>

		<div class="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-12">
			{#each HOW_IT_WORKS_STEPS as { title, description }, index}
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
	}

	.rotate-y-180 {
		transform: rotateY(180deg);
	}
</style>
