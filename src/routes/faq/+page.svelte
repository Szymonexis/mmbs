<script lang="ts">
	import { t } from '$i18n';
	import { FAQ } from '$lib';
</script>

<svelte:head>
	<title>{$t.meta.faq.title}</title>
	<meta name="description" content={$t.meta.faq.description} />
</svelte:head>

<div class="my-6">
	<FAQ />
</div>
