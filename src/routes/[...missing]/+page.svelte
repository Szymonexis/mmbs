<script lang="ts">
	import { goto } from '$app/navigation';
	import { translate } from '$i18n';
</script>

<div class="flex h-full flex-col items-center justify-center gap-6">
	<div class="max-w-96 text-center text-3xl max-sm:text-2xl">
		{$translate('404.message')}
	</div>

	<button
		class="w-fit cursor-pointer rounded-md bg-blue-800 px-4 py-2 font-bold text-white decoration-1 underline-offset-4 hover:underline"
		onclick={() => goto('/')}
	>
		{$translate('404.cta')}
	</button>
</div>
