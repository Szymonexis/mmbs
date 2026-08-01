<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$i18n';
</script>

<svelte:head>
	<title>{$t.meta['404'].title}</title>
	<meta name="description" content={$t.meta['404'].description} />
</svelte:head>

<div class="my-6 flex h-full flex-col items-center justify-center gap-6">
	<div class="max-w-96 text-center text-3xl max-sm:text-2xl">
		{$t['404'].message}
	</div>

	<button
		class="w-fit cursor-pointer rounded-md bg-blue-800 px-4 py-2 font-bold text-white decoration-1 underline-offset-4 hover:underline"
		onclick={() => goto('/')}
	>
		{$t['404'].cta}
	</button>
</div>
