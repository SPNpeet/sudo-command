# Sudo studio redesign — 2026-09-29

The owner requested a complete UX/UI redesign, a stronger Sudo identity, modern visual techniques, free hosting, and a domain change later. This supersedes the earlier orange editorial direction.

## Active implementation

- `src/main.jsx` now loads `Studio.jsx` and `studio.css`. The earlier App/index stylesheet remain in the repository for reference and are not loaded by this entry point.
- `studio-copy.js` supplies the new Thai and English interface copy. Existing service, package, category, FAQ and portfolio data remain in `i18n.js`.
- The original green Sudo mark inspires the ink/ivory/green palette and code-native inline mark. The hero uses actual portfolio screenshots and CSS perspective, with user-selected examples rather than an autoplay simulation.
- Selected work is filterable; the full fourteen-entry portfolio remains on `/portfolio/`. The owner-confirmed n8n / LINE / two-hour fallback case remains prominent, with its published Reel links.
- A three-choice needs selector leads to services. Service scopes, packages and categories use native disclosures. FAQ content is searchable.
- Direct LINE, Messenger, phone and email links remain. The brief tool drafts an email or copies text; it does not claim to submit a lead. External services are not provisioned.
- Menu supports Escape, outside click and explicit close; command search retains keyboard navigation. Display preference is available in the menu. Motion is disabled for reduced-motion preferences. Page content is visible by default.
- The mobile contact dock hides when the contact section is visible and while a brief field is focused.
- All generated service and portfolio pages use `src/detail.css` for the same identity. Build-time HTML, canonical URLs, structured data and sitemap remain.

## Hosting and limits

Continue deploying to the existing free GitHub Pages site. No new hosting, paid tools, subscriptions, ads, analytics or third-party JavaScript were added. Keep the current `/sudo-command/` base until the owner supplies a domain and requests migration. Existing Search Console owner-account selection is still pending.

Production build completed successfully. Desktop light and mobile dark compositions were viewed during authoring. No automated tests were added or run, and no conversion uplift, search ranking, or comprehensive accessibility certification is claimed.

## Owner revision: Command identity

The owner rejected the green/ivory direction and requested every surface be changed. The active design now uses carbon, electric cobalt and coral, a code-native >_ mark, square/cut corners and a different composition: full-width hero heading and showcase, leading project feature, service cards, numbered process rows, new menu/search/form treatments. `src/command.css` supplies the new composition after the base stylesheet. Service, portfolio and privacy pages share the new destination design. Real client imagery remains original. No client brand assets are recolored. Free Pages hosting and factual content remain.
