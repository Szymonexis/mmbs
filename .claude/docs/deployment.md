# Deployment (Vercel)

The site is hosted on **Vercel**. The repo uses `@sveltejs/adapter-auto`, which resolves
to the Vercel adapter during Vercel builds. A local `npm run build` prints
"Could not detect a supported production environment" at the end - that is expected and
harmless; the build output itself is still fully checked.

- Default branch: `master` (deploys from it).
- **Primary domain is `www.mmbs.pl`** - Vercel redirects the apex `mmbs.pl` to it.
  `SITE_ORIGIN` in `src/shared/seo.ts` (canonical/OG URLs, sitemap) and the
  `Sitemap:` line in `static/robots.txt` must match the primary domain; update both
  together if the redirect direction ever changes. The redirect currently responds
  **307** - prefer 308 (permanent) in the Vercel domain settings so search engines
  transfer ranking signals.
- `@vercel/analytics` and `@vercel/speed-insights` are injected in
  `src/routes/+layout.svelte`.
- Remote functions (`*.remote.ts`) compile to `/_app/remote/*` endpoints handled by the
  normal SvelteKit server function - no extra Vercel configuration.

## OG image cache and cron

Portfolio preview images come from the client sites' Open Graph tags. To keep visitors
from triggering a scrape on every page view, the results are stored in the **Vercel
Runtime Cache** (`getCache()` from `@vercel/functions`, namespace `og-image`, 48 h TTL):

- `vercel.json` declares one **cron job**: `GET /portfolio/refresh-og-images` daily at
  04:00 UTC. Crons run only against the production deployment. The endpoint re-scrapes
  every portfolio item without an `ogImageReplacement` and overwrites its cache entry;
  the JSON response lists the urls that failed.
- Vercel sends `Authorization: Bearer $CRON_SECRET` with cron requests. The endpoint
  answers 401 when the header does not match **or when `CRON_SECRET` is not set**.
  Without the secret the cron does nothing and the cache is filled lazily by the first
  visitor after an entry expires - still cached, just not pre-fetched.
- The Runtime Cache is per region and per environment, survives deployments and may
  evict entries, so a miss always falls back to a live scrape. Outside Vercel
  (`npm run dev`) `getCache()` falls back to an in-memory cache and logs
  "Runtime Cache unavailable in this environment" once - expected.
- To test locally: `CRON_SECRET=x npm run dev`, then
  `curl -H "Authorization: Bearer x" localhost:5173/portfolio/refresh-og-images`.

## Environment variables

Defined in `.env` locally (see `.env.example` for the full list) and in the Vercel
project settings for production. Referenced via `$env/static/private` /
`$env/static/public`, so **builds fail if they are missing** - except `CRON_SECRET`,
which is read through `$env/dynamic/private` and is optional at build time.

- `PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA Enterprise site key (browser + assessment)
- `PUBLIC_APP_HASH` - public app hash
- `EMAIL_SENDER` / `EMAIL_RECIEVER` / `EMAIL_PASSWORD` - SMTP via `mail.mmbs.pl:465`
  (note the intentional `RECIEVER` spelling)
- `RECAPTCHA_PROJECT_ID` / `RECAPTCHA_SERVICE_ACCOUNT_KEY` (base64-encoded service
  account JSON) / `RECAPTCHA_SECRET_KEY` - Google Cloud reCAPTCHA Enterprise
- `ENVIRONMENT` - environment name
- `CRON_SECRET` - random string that authorises the daily OG image refresh (see above)
