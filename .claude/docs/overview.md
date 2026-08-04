# MMBS - Project Overview

Company website for MMBS Studio (mmbs.pl). Marketing pages, a portfolio and a contact
form - no database, no auth.

## Stack

- **SvelteKit 2** + **Svelte 5** (runes mode syntax throughout: `$state`, `$derived`, `$props`)
- **Experimental features enabled**: remote functions and `await` in templates - see
  [remote-functions.md](./remote-functions.md)
- **Tailwind CSS 4** (via `@tailwindcss/vite`), some SCSS via `sass-embedded`
- **TypeScript**, ESLint + Prettier (tabs, single quotes)
- Hosted on **Vercel** - see [deployment.md](./deployment.md)

## Commands

- `npm run dev` - dev server
- `npm run build` - production build
- `npm run check` - `svelte-kit sync` + `svelte-check` (type checking)
- `npm run lint` / `npm run lint:fix` - Prettier check + ESLint
- `npm run format` - Prettier write

## Structure

- `src/routes/` - pages: `/` (home, team, contact form), `/services`, `/portfolio`, `/faq`,
  `[...missing]` (404 catch-all)
- `src/lib/` - components, re-exported from `src/lib/index.ts` (`Header`, `Footer`,
  `ContactForm`, `TechnologiesCarousel`, `FAQ`)
- `src/shared/` - cross-cutting helpers; `src/shared/server/` holds server-only code
  (reCAPTCHA assessment, DTO validation)
- `src/i18n/` - custom store-based i18n
- Aliases (svelte.config.js): `$shared`, `$i18n`, `$services` (currently unused - the
  `src/services` dir does not exist)

## Conventions

- **Comments: only when EXTREMELY necessary - code must document itself.** No comments
  that restate what the code/types already say, no section banners, no change logs, no
  commented-out code left "just in case". Prefer clear names, small functions and precise
  types over a comment. A comment earns its place only when it captures something the code
  cannot: a non-obvious _why_, a genuine gotcha, or an external constraint. When in doubt,
  delete it. Architectural rationale belongs in `.claude/docs/`, not inline.
- Nearly every route/component folder has a `model.ts` with its types, constants and pure
  data-shaping logic; the `.svelte` file consumes it.
- UI text is never hardcoded - components read the active locale's dictionary from the `$t`
  store exported by `$i18n`, e.g. `$t.header.home` or, for dynamic text,
  `$t.portfolio.pagination.page({ current, total })` (such fields are functions taking one
  options object). Translations are typed `as const` objects; English defines the shape and
  every other locale is `... as const satisfies TranslationDictionary`, so missing keys,
  wrong list lengths or mismatched signatures are compile errors. See
  [i18n.md](./i18n.md).
- Locale is a Svelte store (`currentLocale`), persisted via `src/shared/browser/local-storage.ts`.

## Feature notes

- **SEO** (`src/shared/seo.ts`, `src/lib/PageMeta/`, `src/lib/server/og/`): `PAGES` in
  `seo.ts` lists the indexable routes. `/sitemap.xml` and `/og/[page].png` are
  `+server.ts` endpoints with `prerender = true`, so both regenerate on every build -
  there is no static sitemap and no external OG-image service. OG images are rendered
  with satori + `@resvg/resvg-js` (devDependencies) from the vendored brand fonts and
  logo PNG in `src/lib/server/og/assets/`, using the **English** dictionary (URLs carry
  no locale, so crawlers get the default locale). Every page renders
  `<PageMeta page="…" />` instead of a hand-written `<svelte:head>`; it emits the
  title/description, canonical link and OG/Twitter tags (site_name, locale +
  alternates, image dimensions/alt) with absolute URLs based on `SITE_ORIGIN`.
  All pages are **fully prerendered** (`prerender = true` in `src/routes/+layout.ts`;
  the `[...missing]` 404 catch-all opts out) and served as static HTML from the CDN -
  keep new pages prerenderable or opt them out explicitly. Heading rule: exactly one
  `<h1>` per page (portfolio uses an `sr-only` one; project/member names are `h2`/`h3`).

- **Portfolio** (`src/routes/portfolio/`): items are declared in `model.ts`
  (`portfolioListBase`), sorted by start date, paginated client-side (10 per page). Each
  item carries only structural data (url, dates, labels, media urls); its visible text
  lives in the dictionary under `$t.portfolio.projects[item.key]`. Preview images:
  either a static `ogImageReplacement` asset or scraped live via the `getOgImage` remote
  query (`portfolio.remote.ts`) awaited directly in the template inside a
  `<svelte:boundary>` with a skeleton `pending` snippet.
  - The **rkwk** entry is commented out in `portfolioListBase` - that client project was
    paused in 2026 and is not expected to return. Leave it commented unless told otherwise.
- **Contact form** (`src/lib/ContactForm/`): svelte-forms-lib + yup for client-side
  validation (`model.ts`), reCAPTCHA Enterprise token fetched in the browser, then the
  `sendEmailRequest` remote command (`contact-form.remote.ts`) re-validates the payload
  (class-validator), scores the token server-side and sends the email with nodemailer via
  `mail.mmbs.pl`.
