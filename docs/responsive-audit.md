# Responsive audit — 29 September 2026

## Verified browser viewport matrix
Homepage Thai and English: 320x568, 375x812, 430x932, 768x1024,
1024x768, 1366x768, 1920x1080, 844x390. Read actual innerWidth/innerHeight
for each case. No document horizontal overflow after fixes. The rendered
homepage controls outside closed disclosures passed the 44px target geometry
check (1px measurement tolerance). Expanded states were exercised separately.

Seven destination pages: portfolio, website, seo, ads, web-app-automation,
line-oa and privacy at widths 320, 768 and 1366. No document horizontal
overflow; visible link/summary heights at least 44px after fixes.
Local generated HTML was temporarily pointed at local search.css for this audit
because its production URLs otherwise fetch the deployed stylesheet. These
preview-only HTML substitutions are not committed and are replaced by build.

## Fixed
- Mobile menu extended left of the viewport.
- Short landscape project dialog had overlapping sidebar tools and footer.
  Short windows now use a vertically scrollable dialog with sticky close header.
- Small screen previous/next buttons shrank below 44px.
- Reel selectors on 320px were only about 33px wide. They now use three columns
  below the cover on narrow phones.
- Short English filter/navigation/privacy labels had narrow touch targets.
- Shared destination-page inline links and brand link needed taller targets.
- Preview cleanup restored focus while the background was still inert.
  Close the native dialog before restoring the opener; remove premature autofocus.
- Bottom dock accounts for device safe-area inset.

## Interaction checks
- Client preview opens, Escape closes, original client button regains focus,
  body scroll unlocks (observed true after fix).
- Website filter displays four projects; reset restores all.
- Service CTA selects svc-web, routes to contact, focuses brief-business.
- Empty FAQ search result and clearing search work.
- Search palette Contact selection closes dialog and routes to #contact.
- Brief inputs populate mailto draft; temporary QA content cleared; nothing sent.
- Second truck reel updates destination to /reel/2520092948458951.
- Dark/light and Thai/English exercised.

Build passed. Lint exited 0 with two pre-existing warnings in RoiCalc.jsx and
ServiceVisuals.jsx. No new dependency added.

## Limits
These are browser viewport checks, not physical iOS/Android device tests.
Actual mobile keyboard behaviour, hardware safe-area rendering, Safari-specific
behaviour, screen reader output and OS reduced-motion emulation were not fully
validated. Existing reduced-motion CSS retained. No claim of zero possible bugs.
