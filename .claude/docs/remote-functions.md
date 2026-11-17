# Remote Functions & Async Svelte

This repo uses two experimental features (modelled after
https://github.com/Szymonexis/sveltekit-remote-example):

- **SvelteKit remote functions** - `query()` / `command()` from `$app/server` in
  `*.remote.ts` files replace hand-written `/api` `+server.ts` endpoints. Requires
  `@sveltejs/kit` >= 2.27 (installed: 2.36.x).
- **Svelte async / `await` in templates** - `await` at the top level of `<script>`, in
  `$derived()` and in markup. Requires `svelte` >= 5.36 (installed: 5.38.x).

Both flags live in `svelte.config.js`:

```js
compilerOptions: { experimental: { async: true } },
kit: { experimental: { remoteFunctions: true } }
```

## Remote files in this repo

- `src/lib/ContactForm/contact-form.remote.ts` - `sendEmailRequest` **command**
  (validates payload, scores reCAPTCHA, sends the email).
- `src/routes/portfolio/portfolio.remote.ts` - `getOgImage(url)` **query** (returns the
  site's Open Graph image as `ImageObject | null`, read from the Vercel Runtime Cache and
  scraped server-side only on a cache miss; never throws on scrape or cache failure - the
  UI falls back to a placeholder). The yup schema accepts only the urls of portfolio items
  without an `ogImageReplacement`, so the endpoint cannot be used to scrape or cache
  arbitrary sites. The scrape + cache logic lives in `og-image.server.ts` because the
  cron endpoint shares it.

## Rules & gotchas

- A `*.remote.ts` file may **only export remote functions** (`query`, `command`, `form`,
  `prerender`). Anything else (DTO classes, helpers) must be non-exported inside the file
  or live elsewhere. Remote files can sit anywhere in `src/` except `src/lib/server/`.
- Validation: we use the `'unchecked'` overload (`query('unchecked', fn)`) and validate
  inside with the existing **class-validator** DTO pattern via
  `$shared/server/validate-dto.ts` (`validateDto` throws a kit `error(400, ...)`).
  If class-validator is ever dropped, switch to a Standard Schema library (zod/valibot)
  passed as the first argument instead - that is the idiomatic upstream approach.
- The DTO classes are declared _inside_ the remote files and deliberately not exported
  (see the "only remote functions" rule). Client code gets full typing from the
  command/query signature itself.
- **Commands cannot run during render** - call them from event handlers only, wrap in
  try/catch (see `ContactForm.svelte`).
- **Queries are cached per argument** for the lifetime of the page - awaiting
  `getOgImage(url)` twice (e.g. for `src` and `alt`) issues one request. `.refresh()` /
  `.withOverride()` are available for invalidation/optimistic updates.
- `await` in markup must be inside a `<svelte:boundary>`; during **SSR** a boundary with a
  `pending` snippet renders the snippet and skips its content (so the portfolio page
  server-renders skeletons and resolves the queries client-side - no slow scraping in
  SSR). Add a `failed` snippet for errors; without any boundary an error would crash to
  the nearest (nonexistent) boundary.
- With `experimental.async` on, an `afterNavigate` callback registered in a page does
  **not** run for the initial page load (kit 2.36 fires the `enter` callbacks before the
  page's `onMount` has registered them). Use `onMount` for work that must also happen on
  a hard load - see the deep-link handling in `src/routes/portfolio/+page.svelte`.
- At runtime remote functions become generated `/_app/remote/<hash>/<name>` endpoints -
  nothing to configure on Vercel.
- `npm run check` (svelte-check) validates all of this; run it after touching remote
  files or templates using `await`.
