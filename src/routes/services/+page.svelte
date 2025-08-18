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
	<!-- bigger than or equal to sm -->
  <div class="flex flex-col items-center max-sm:hidden">
    <div
      class="mb-12 gap-6 max-lg:max-w-190 max-sm:flex max-sm:flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3"
    >
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
            fetchpriority="high"
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
