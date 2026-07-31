# Deployment (Vercel)

The site is hosted on **Vercel**. The repo uses `@sveltejs/adapter-auto`, which resolves
to the Vercel adapter during Vercel builds. A local `npm run build` prints
"Could not detect a supported production environment" at the end — that is expected and
harmless; the build output itself is still fully checked.

- Default branch: `master` (deploys from it).
- `@vercel/analytics` and `@vercel/speed-insights` are injected in
  `src/routes/+layout.svelte`.
- Remote functions (`*.remote.ts`) compile to `/_app/remote/*` endpoints handled by the
  normal SvelteKit server function — no extra Vercel configuration.

## Environment variables

Defined in `.env` locally (see `.env.example` for the full list) and in the Vercel
project settings for production. Referenced via `$env/static/private` /
`$env/static/public`, so **builds fail if they are missing**.

- `PUBLIC_RECAPTCHA_SITE_KEY` — reCAPTCHA Enterprise site key (browser + assessment)
- `PUBLIC_APP_HASH` — public app hash
- `EMAIL_SENDER` / `EMAIL_RECIEVER` / `EMAIL_PASSWORD` — SMTP via `mail.mmbs.pl:465`
  (note the intentional `RECIEVER` spelling)
- `RECAPTCHA_PROJECT_ID` / `RECAPTCHA_SERVICE_ACCOUNT_KEY` (base64-encoded service
  account JSON) / `RECAPTCHA_SECRET_KEY` — Google Cloud reCAPTCHA Enterprise
- `ENVIRONMENT` — environment name
