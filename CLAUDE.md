# MMBS

Company website for MMBS Studio (mmbs.pl) - SvelteKit 2 + Svelte 5 (runes), Tailwind 4,
hosted on Vercel.

Before working on this repo, read the docs in `.claude/docs/`:

- `.claude/docs/overview.md` - stack, structure, conventions, feature notes
- `.claude/docs/i18n.md` - how all UI text works: the typed `$t` dictionary, English as
  the source of truth, `as const satisfies` locales (read before touching `src/i18n/` or
  adding/changing any user-facing text)
- `.claude/docs/remote-functions.md` - experimental remote functions + `await` in
  templates (how all client↔server communication works here; read before touching
  `*.remote.ts` files or templates)
- `.claude/docs/deployment.md` - Vercel setup and required environment variables

Comments only when EXTREMELY necessary - code must document itself (see overview.md).

Always run `npm run check` and `npm run lint` after changes.
