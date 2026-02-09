<script lang="ts">
	import { translate } from '$i18n';
	import { TechnologiesCarousel } from '$lib';
	import { SOCIAL_MEDIA_LINKS } from './model';
</script>

<div class="m-auto my-6 max-w-7xl">
	<TechnologiesCarousel />
</div>

<div class="bg-blue-800">
	<div
		class="m-auto flex h-full min-h-24 max-w-7xl items-center justify-center gap-6 p-6 text-white max-sm:flex-wrap"
	>
		<img
			class="h-12 object-contain brightness-[100] saturate-0 max-sm:hidden"
			src="/mmbs-logo.webp"
			alt="MMBS Logo"
			loading="lazy"
			fetchpriority="low"
		/>

		<div class="flex flex-col justify-center text-nowrap">
			<span class="text-xs">{$translate('footer.mmbsBrandInfo')}</span>
			<span class="text-xs">{$translate('footer.innovioName')}</span>
			<span class="text-xs">{$translate('footer.nip')}</span>
		</div>

		<div class="flex flex-col justify-center text-nowrap">
			<span class="text-xs">{$translate('footer.regon')}</span>
			<span class="text-xs">{$translate('footer.addressLine1')}</span>
			<span class="text-xs">{$translate('footer.addressLine2')}</span>
		</div>

		<span class="flex-auto max-sm:hidden"></span>

		<div class="flex flex-wrap gap-2">
			{#each SOCIAL_MEDIA_LINKS as { href, src, alt }, i (i)}
				<a {href} class="cursor-pointer" target="_blank">
					<img class="aspect-square w-6 brightness-0 invert" {src} {alt} />
				</a>
			{/each}
		</div>
	</div>
</div>
