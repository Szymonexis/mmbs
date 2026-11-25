<script lang="ts">
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { EasterEgg } from './easter-egg.svelte';
	import { FADE_MS, markEasterEggFound } from './model';

	let { easterEgg }: { easterEgg: EasterEgg } = $props();

	function enterGame() {
		markEasterEggFound();
		goto(resolve('/cgol'));
	}
</script>

{#if easterEgg.solved}
	<div
		class="fixed inset-0 z-2000 bg-black"
		in:fade={{ duration: FADE_MS }}
		onintroend={enterGame}
	></div>
{/if}
