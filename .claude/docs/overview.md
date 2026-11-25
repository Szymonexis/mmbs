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

- `nix-shell shell.nix` - optional dev shell with Node.js 26
- `npm run dev` - dev server
- `npm run build` - production build
- `npm run check` - `svelte-kit sync` + `svelte-check` (type checking)
- `npm run lint` / `npm run lint:fix` - Prettier check + ESLint
- `npm run format` - Prettier write

## Structure

- `src/routes/` - pages: `/` (home, featured projects, team, contact form), `/services`,
  `/portfolio`, `/faq`, `[...missing]` (404 catch-all), `/cgol` (Game of Life easter egg,
  not linked anywhere yet); `/portfolio/refresh-og-images` is the cron-only endpoint that
  refreshes the OG image cache
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
  (`portfolioListBase`), sorted most recent first (`byMostRecent`: by end date, ongoing
  `'now'` items on top, then by start date), paginated client-side (10 per page). Each
  item carries only structural data (url, dates, labels, priority, media urls); its
  visible text lives in the dictionary under `$t.portfolio.projects[item.key]`.
  - **Preview images** are rendered by `ProjectImage.svelte` (shared with the home page):
    either a static `ogImageReplacement` asset or the site's Open Graph image, resolved by
    the `getOgImage` remote query (`portfolio.remote.ts`) awaited in the template inside a
    `<svelte:boundary>` with a skeleton `pending` snippet. A site without an `og:image`
    needs an `ogImageReplacement`.
  - **OG image cache** (`og-image.server.ts`): scrape results are kept in the Vercel
    Runtime Cache for 48 h, so visitors do not trigger a scrape. A daily Vercel cron
    (`vercel.json`) calls `/portfolio/refresh-og-images`, which re-scrapes every item
    without an `ogImageReplacement`; a failed scrape keeps the previous entry. See
    [deployment.md](./deployment.md).
  - **Home page section** ("Our Projects", right under the hero): `getHomePortfolioItems()`
    returns at most `HOME_PORTFOLIO_LIMIT` items sorted by `priority` (higher first), then
    most recent first. `priority` affects only this section - the portfolio page ignores it.
    The first item is the large featured tile.
  - **Deep links**: every item on the portfolio page has `id={key}`, and the home tiles
    link to `/portfolio#<key>`. On mount the page switches to the linked item's page,
    opens its description and scrolls to it.
  - **rkwk** has no entry in `portfolioListBase` - that client project was paused in 2026
    and is not expected to return. Its texts (`projects.rkwk`) and image
    (`static/portfolio/rkwk/`) are kept; do not re-add the entry unless told otherwise.
  - **hyzo** and **oddamButelki** were added before their public launches. Neither site
    exposes an `og:image`, so both use a screenshot as `ogImageReplacement` (Hyzo: the
    landing hero; Oddam butelki: the "coming soon" page). `hyzo` has `priority: 1` because
    it is the only one of the two with a live site, which makes it the featured home
    tile. When Oddam butelki launches, replace its screenshot, refresh its description
    (it says the app is being prepared for launch and leaves out payments at the client's
    request) and reconsider the priorities; once a site gains an `og:image`, drop its
    replacement so the scraper takes over.
- **Hash links across pages** (`/#contactUs`, `/portfolio#<key>`): `app.css` sets
  `scroll-behavior: smooth` site-wide, but SvelteKit records the scroll position right
  after jumping to a hash and restores it a moment later, which rolls a smooth scroll back
  to where it started. `onNavigate` in `src/routes/+layout.svelte` therefore switches to
  instant scrolling for navigations whose target has a hash. Same-page hash links stay
  smooth.
- **Contact form** (`src/lib/ContactForm/`): svelte-forms-lib + yup for client-side
  validation (`model.ts`), reCAPTCHA Enterprise token fetched in the browser, then the
  `sendEmailRequest` remote command (`contact-form.remote.ts`) re-validates the payload
  (class-validator), scores the token server-side and sends the email with nodemailer via
  `mail.mmbs.pl`.
- **Game of Life easter egg** (`src/routes/cgol/`): a full-screen canvas overlay. The root
  layout renders no Header/Footer on this route, so nothing focusable sits under it.
  - **Trigger** (`trigger/`, used by the home page's "Our Team" section): clicking the team
    photos in the order Maja, Maciej, Bartek, Szymon (not the page order) flips each photo
    (`rotateX`, `MemberPhoto.svelte`) to a running oscillator from `consts/oscillators.ts`,
    four distinct ones per run. A wrong click flips everything back (clicking Maja restarts
    the sequence). After the last flip the page fades to black (`GameEntrance.svelte`),
    `easter-egg-found` is saved in **sessionStorage** (`src/shared/browser/session-storage.ts`,
    prefixed like the localStorage keys) and the app navigates to `/cgol`. The photos are
    deliberately undiscoverable: default cursor, not focusable, back face `aria-hidden`, and
    the click handler carries a `svelte-ignore` for the keyboard/role a11y warnings.
  - **Gate** (`+page.svelte`, `+page.ts`): the route has `ssr = false`, so the prerendered
    `cgol.html` is an empty shell. Its `load` returns `unlocked` from the session flag: the
    game (`Game.svelte`) renders only when it is set, otherwise the page shows the same
    `NotFound` component (`src/lib/NotFound/`) as the `[...missing]` catch-all. The root
    layout drops Header/Footer only for an unlocked `/cgol` (`page.data.unlocked`), so the
    locked route looks exactly like any other missing page.
  - **Oscillators** (`consts/oscillators.ts`) were verified by simulation like the presets
    (exact period, never dies or emits, fits 16x16); pulsar and pentadecathlon reuse the
    preset rows. The cards size each pattern to the union of its phases over 60 generations.
  - **Controls** (`game/gestures.ts`): left click / tap adds a cell, left drag / one-finger
    drag paints a line of cells, right drag / two-finger drag pans, wheel / pinch zooms
    around the cursor or finger midpoint. A touch only starts painting after moving past a
    small slop, so a two-finger gesture never leaves a stray cell. Esc or the close button
    exits: `history.back()` when the previous entry is known to be the page the user came
    from, otherwise `/`.
  - **Sim loop** (`+page.svelte`, `model.ts`): fixed-step accumulator with an interval of
    10 ms - 10 s, set in a number input that applies on Enter / blur / arrow keys (not
    per keystroke, so typing 2000 never briefly runs at 2 or 20 ms) and clamps to the
    range. Work per frame is capped both by tick count and
    by an 8 ms budget, so a large world lowers the tick rate (visible as tps) instead of
    the frame rate.
  - **Presets** (`consts/patterns.ts`): plaintext rows, x = column, y = row (down). Each
    was verified by simulation (periods and displacements; R-pentomino 116 cells at gen
    1103, acorn 633 at gen 5206, diehard dies at gen 130). Re-verify any pattern you edit.
    Loading a preset replaces the world and recenters the camera. A random preset is loaded
    in `onMount` (client-only, so the prerendered page does not bake in one choice).
  - **Mobile layout**: below `sm` the preset buttons stack in a column above play/pause and
    the interval field stretches across the row. Button size follows the pointer type, not
    the width: compact sizes are `sm:pointer-fine:*` only, so touch screens (including
    phones in landscape and tablets) keep 36-44 px targets. The same rule decides when the
    arrow button that hides the presets exists: everywhere except `sm:pointer-fine`
    (desktop with a mouse always shows them). The whole overlay is `touch-none`, so
    double-tap or pinch over the controls cannot zoom the page; the interval input is
    `select-text` because an inherited `user-select: none` blocks typing in iOS Safari.
