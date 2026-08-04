import { PAGES, SITE_ORIGIN } from '$shared/seo';

export const prerender = true;

export function GET(): Response {
	const lastmod = new Date().toISOString();

	const urls = PAGES.map(
		({ path, priority }) => `	<url>
		<loc>${SITE_ORIGIN}${path}</loc>
		<lastmod>${lastmod}</lastmod>
		<priority>${priority.toFixed(2)}</priority>
	</url>`
	).join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
