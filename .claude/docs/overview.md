# MMBS — Project Overview

Company website for MMBS Studio (mmbs.pl). Marketing pages, a portfolio and a contact
form — no database, no auth.

## Stack

- **SvelteKit 2** + **Svelte 5** (runes mode syntax throughout: `$state`, `$derived`, `$props`)
- **Experimental features enabled**: remote functions and `await` in templates — see
  [remote-functions.md](./remote-functions.md)
- **Tailwind CSS 4** (via `@tailwindcss/vite`), some SCSS via `sass-embedded`
- **TypeScript**, ESLint + Prettier (tabs, single quotes)
- Hosted on **Vercel** — see [deployment.md](./deployment.md)

## Commands

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run check` — `svelte-kit sync` + `svelte-check` (type checking)
- `npm run lint` / `npm run lint:fix` — Prettier check + ESLint
- `npm run format` — Prettier write

## Structure

- `src/routes/` — pages: `/` (home, team, contact form), `/services`, `/portfolio`, `/faq`,
  `[...missing]` (404 catch-all)
- `src/lib/` — components, re-exported from `src/lib/index.ts` (`Header`, `Footer`,
  `ContactForm`, `TechnologiesCarousel`, `FAQ`)
- `src/shared/` — cross-cutting helpers; `src/shared/server/` holds server-only code
  (reCAPTCHA assessment, DTO validation)
- `src/i18n/` — custom store-based i18n
- Aliases (svelte.config.js): `$shared`, `$i18n`, `$services` (currently unused — the
  `src/services` dir does not exist)

## Conventions

- **Comments: only when EXTREMELY necessary — code must document itself.** No comments
  that restate what the code/types already say, no section banners, no change logs, no
  commented-out code left "just in case". Prefer clear names, small functions and precise
  types over a comment. A comment earns its place only when it captures something the code
  cannot: a non-obvious _why_, a genuine gotcha, or an external constraint. When in doubt,
  delete it. Architectural rationale belongs in `.claude/docs/`, not inline.
- Nearly every route/component folder has a `model.ts` with its types, constants and pure
  data-shaping logic; the `.svelte` file consumes it.
- UI text is never hardcoded — components read the active locale's dictionary from the `$t`
  store exported by `$i18n`, e.g. `$t.header.home` or, for dynamic text,
  `$t.portfolio.pagination.page({ current, total })` (such fields are functions taking one
  options object). Translations are typed `as const` objects; English defines the shape and
  every other locale is `... as const satisfies TranslationDictionary`, so missing keys,
  wrong list lengths or mismatched signatures are compile errors. See
  [i18n.md](./i18n.md).
- Locale is a Svelte store (`currentLocale`), persisted via `src/shared/browser/local-storage.ts`.

## Feature notes

- **Portfolio** (`src/routes/portfolio/`): items are declared in `model.ts`
  (`portfolioListBase`), sorted by start date, paginated client-side (10 per page). Each
  item carries only structural data (url, dates, labels, media urls); its visible text
  lives in the dictionary under `$t.portfolio.projects[item.key]`. Preview images:
  either a static `ogImageReplacement` asset or scraped live via the `getOgImage` remote
  query (`portfolio.remote.ts`) awaited directly in the template inside a
  `<svelte:boundary>` with a skeleton `pending` snippet.
  - The **rkwk** entry is commented out in `portfolioListBase` — that client project was
    paused in 2026 and is not expected to return. Leave it commented unless told otherwise.
- **Contact form** (`src/lib/ContactForm/`): svelte-forms-lib + yup for client-side
  validation (`model.ts`), reCAPTCHA Enterprise token fetched in the browser, then the
  `sendEmailRequest` remote command (`contact-form.remote.ts`) re-validates the payload
  (class-validator), scores the token server-side and sends the email with nodemailer via
  `mail.mmbs.pl`.
