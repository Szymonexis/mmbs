<script lang="ts">
	import { translate } from '$i18n';
	import { FAQ } from '$lib';
</script>

<svelte:head>
	<title>{$translate('meta.faq.title')}</title>
	<meta name="description" content={$translate('meta.faq.description')} />
</svelte:head>

<div class="my-6">
	<FAQ />
</div>
