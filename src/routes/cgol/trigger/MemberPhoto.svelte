<script lang="ts">
	import type { MemberKey } from '../../model';
	import type { EasterEgg } from './easter-egg.svelte';
	import { FLIP_MS } from './model';
	import Oscillator from './Oscillator.svelte';

	let {
		memberKey,
		image,
		alt,
		easterEgg
	}: { memberKey: MemberKey; image: string; alt: string; easterEgg: EasterEgg } = $props();

	const pattern = $derived(easterEgg.revealed[memberKey]);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
	class="w-full select-none perspective-distant max-sm:aspect-square sm:max-w-60"
	onclick={() => easterEgg.click(memberKey)}
>
	<div
		class={[
			'relative h-full w-full transition-transform transform-3d motion-reduce:transition-none',
			pattern && 'rotate-x-180'
		]}
		style:transition-duration="{FLIP_MS}ms"
	>
		<img
			class="h-full w-full rounded-md object-cover backface-hidden"
			src={image}
			{alt}
			loading="lazy"
			fetchpriority="low"
			draggable="false"
		/>
		<div
			class="absolute inset-0 rotate-x-180 overflow-hidden rounded-md bg-black backface-hidden"
			aria-hidden="true"
		>
			{#if pattern}
				{#key pattern}
					<Oscillator {pattern} />
				{/key}
			{/if}
		</div>
	</div>
</div>
