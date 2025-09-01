<script lang="ts">
	import { FAQ } from '$lib';
	import { onDestroyLog, onMountLog } from '$shared/browser/log-functions';
	import { onDestroy, onMount } from 'svelte';

	onMount(async () => {
		await onMountLog();
	});

	onDestroy(async () => {
		await onDestroyLog();
	});
</script>

<div class="my-6">
	<FAQ />
</div>
