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

## Environment variables

Defined in `.env` locally (see `.env.example` for the full list) and in the Vercel
project settings for production. Referenced via `$env/static/private` /
`$env/static/public`, so **builds fail if they are missing**.

- `PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA Enterprise site key (browser + assessment)
- `PUBLIC_APP_HASH` - public app hash
- `EMAIL_SENDER` / `EMAIL_RECIEVER` / `EMAIL_PASSWORD` - SMTP via `mail.mmbs.pl:465`
  (note the intentional `RECIEVER` spelling)
- `RECAPTCHA_PROJECT_ID` / `RECAPTCHA_SERVICE_ACCOUNT_KEY` (base64-encoded service
  account JSON) / `RECAPTCHA_SECRET_KEY` - Google Cloud reCAPTCHA Enterprise
- `ENVIRONMENT` - environment name
