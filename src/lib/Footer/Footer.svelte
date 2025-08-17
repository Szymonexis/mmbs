<script lang="ts">
	import { translate } from '$i18n';
	import { TechnologiesCarousel } from '$lib';

	const SOCIAL_MEDIA_LINKS = [
		{
			href: 'https://github.com/MMBS-Studio',
			src: '/links/github.svg',
			alt: 'MMBS Studio Github'
		},
		{
			href: 'https://www.instagram.com/mmbs_studio/',
			src: '/links/instagram.svg',
			alt: 'MMBS Studio Instagram'
		},
		{
			href: 'https://www.linkedin.com/company/mmbs-studio',
			src: '/links/linkedin.svg',
			alt: 'MMBS Studio Linkedin'
		}
	];
</script>

<div class="m-auto my-6 max-w-7xl">
	<TechnologiesCarousel />
</div>

<div class="bg-blue-800">
	<div
		class="m-auto flex h-full min-h-24 max-w-7xl items-center gap-6 p-6 text-white max-sm:flex-wrap"
	>
		<img
			class="h-12 object-contain brightness-[100] saturate-0 max-sm:hidden"
			src="/mmbs-logo.webp"
			alt="MMBS Logo"
			loading="lazy"
			fetchpriority="low"
		/>

		<div class="flex flex-col justify-center">
			<span class="text-xs">Innovio</span>
			<span class="text-xs">NIP: 7272867774</span>
			<span class="text-xs">REGON: 524884230</span>
		</div>

		<span class="flex-auto max-sm:hidden"></span>

		<div class="flex flex-col justify-center">
			<span class="text-xs">{$translate('footer.contact')}</span>
			<span class="text-xs">{$translate('footer.phoneNumber')}</span>
			<a class="text-xs" href="mailto:szymonkaszubagalka.innovio@gmail.com">
				{$translate('footer.email')}
			</a>
		</div>

		<div class="grid grid-cols-2 grid-rows-2 gap-2">
			{#each SOCIAL_MEDIA_LINKS as { href, src, alt }}
				<a {href} class="cursor-pointer" target="_blank">
					<img class="aspect-square w-6 brightness-0 invert" {src} {alt} />
				</a>
			{/each}
		</div>
	</div>
</div>
