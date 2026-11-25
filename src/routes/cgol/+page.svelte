<script lang="ts">
	import { NotFound } from '$lib';
	import Game from './Game.svelte';

	let { data } = $props();
</script>

{#if data.unlocked}
	<Game />
{:else}
	<NotFound />
{/if}
