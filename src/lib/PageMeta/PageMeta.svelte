<script lang="ts">
	import { currentLocale, Locale, t } from '$i18n';
	import { ogImagePath, PAGES, SITE_NAME, SITE_ORIGIN, type PageMetaKey } from '$shared/seo';

	let { page }: { page: PageMetaKey } = $props();

	const ogPage = $derived(page === '404' ? 'home' : page);
	const path = $derived(PAGES.find(({ key }) => key === ogPage)?.path ?? '/');
	const url = $derived(SITE_ORIGIN + path);
	const image = $derived(SITE_ORIGIN + ogImagePath(ogPage));
	const domain = new URL(SITE_ORIGIN).host;
	const ogLocale = $derived($currentLocale.replace('-', '_'));
	const ogLocaleAlternates = $derived(
		Object.values(Locale)
			.filter((locale) => locale !== $currentLocale)
			.map((locale) => locale.replace('-', '_'))
	);
</script>

<svelte:head>
	<title>{$t.meta[page].title}</title>
	<meta name="description" content={$t.meta[page].description} />
	<link rel="canonical" href={url} />

	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content={ogLocale} />
	{#each ogLocaleAlternates as alternate (alternate)}
		<meta property="og:locale:alternate" content={alternate} />
	{/each}
	<meta property="og:title" content={$t.meta[page].title} />
	<meta property="og:description" content={$t.meta[page].description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={$t.meta[page].title} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={domain} />
	<meta property="twitter:url" content={url} />
	<meta name="twitter:title" content={$t.meta[page].title} />
	<meta name="twitter:description" content={$t.meta[page].description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={$t.meta[page].title} />
</svelte:head>
