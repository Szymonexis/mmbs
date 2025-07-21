<script lang="ts">
	import { translate } from '$i18n';
	import { HOW_IT_WORKS_STEPS, SERVICE_CARDS } from './model';

	let selectedIndex: number | null = null;

	function toggleCardSelection(index: number) {
		if (selectedIndex === index) {
			selectedIndex = null;
		} else {
			selectedIndex = index;
		}
	}
</script>

<div class="my-6">
	<div class="flex flex-col items-center">
		<div class="mb-12 grid max-w-190 grid-cols-2 gap-6 lg:max-w-full lg:grid-cols-3">
			{#each SERVICE_CARDS as { title, description, image: { src, alt } }, index}
				<button
					onclick={() => toggleCardSelection(index)}
					class={`relative cursor-pointer rounded-md border-4 ${index === selectedIndex ? 'border-blue-800/50' : 'border-blue-800/5 hover:border-blue-800/20'} `}
				>
					<img
						class="aspect-square w-full object-contain select-none"
						class:opacity-5={index === selectedIndex}
						{src}
						alt={$translate(alt)}
						draggable="false"
					/>

					{#if selectedIndex === index}
						<div class="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
							<div class="p-6 text-center">
								<div class="unbounded mb-4 text-xl">{$translate(title)}</div>

								<div class="text-md">{$translate(description)}</div>
							</div>
						</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<div class="my-12">
		<div class="unbounded my-12 text-center text-4xl text-blue-800">
			{$translate('services.howItWorks.title')}
		</div>

		<div class="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-12">
			{#each HOW_IT_WORKS_STEPS as { title, description }, index}
				<div class="flex items-center gap-2">
					<div class="unbounded w-[1em] text-right text-7xl text-blue-800">
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
