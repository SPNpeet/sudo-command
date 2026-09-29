# Organic discovery — 2026-09-29

Owner constraint: zero advertising spend. Do not create paid campaigns, trials requiring payment details, or subscriptions as part of this work.

## Published foundation

- Five Thai service pages with distinct URLs, useful scope/preparation/FAQ content, canonical URLs, social metadata, Service and BreadcrumbList structured data.
- A complete portfolio page generated from the same work and screenshot data as the app.
- Visible homepage HTML before JavaScript starts; the existing React application replaces it normally. No crawler-specific response or hidden keyword blocks.
- Navigation from the app to all service pages and portfolio.
- A generated sitemap with the homepage plus six detail pages. Dates are not fabricated on each build.
- Existing public contact channels reused consistently. No new ad tracking or third-party marketing scripts.

Run `npm run build` to generate the deployable pages. `scripts/build-search.mjs` must run after Vite; the existing deployment uses this command. Generated files live in `dist`, with authored content in `src/search-pages.js`. Detail pages are Thai and the English app labels them `(TH)`.

## Account setup still needs the selected owner account

Use a URL-prefix Search Console property for `https://spnpeet.github.io/sudo-command/`. Do not verify the site under a client's Google account. Submit `https://spnpeet.github.io/sudo-command/sitemap.xml` after ownership is confirmed. A sitemap submission is not proof of indexing. Follow actual indexing and performance reports.

The project lives in a subdirectory. Its `/sudo-command/robots.txt` is not a host-root robots file; do not claim it controls crawling for `spnpeet.github.io`. Search engines use `/robots.txt` on the host. Submit the project sitemap directly through webmaster tools when access is available.

For Bing Webmaster Tools, use the owner's selected account and import the verified Search Console property or complete the provided site verification. No Bing submission is claimed until the service confirms it.

Only set up Google Business Profile after confirming eligibility: an online-only business is not eligible. Do not invent a storefront, service visits, reviews or opening hours.

## Ongoing work with no ad budget

Update the portfolio when work is delivered, answer specific customer questions with useful pages, and keep the same business name/contact details on profiles the owner controls. Publish or request links from other people only with authorization. Review Search Console impressions, clicks, queries and landing pages alongside actual enquiries; there is no guaranteed date, rank or lead count.

References: [Google Search Essentials](https://developers.google.com/search/docs/essentials), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [robots.txt location](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt), [Business Profile eligibility](https://support.google.com/business/answer/13763036).
