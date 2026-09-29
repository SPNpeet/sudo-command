# UX detail pass — 29 September 2026

## Implemented

| Surface | Concrete change |
| --- | --- |
| All seven screenshot projects | Show every supplied gallery image on the homepage, plus the n8n case. Keep project numbers stable across filters. |
| Hero and gallery | Open actual images in an accessible native dialog; separate public-site links from image inspection. |
| Image viewer | Visible close control, Escape/backdrop dismissal, scrollable original image, body scroll locking and return focus. Original file and website links remain available. |
| Image loading failure | Explain failure in the viewer and retain the original-image link. |
| Service enquiry | Store the selected service/package by ID so its label follows the selected language. Show the selected service explicitly. |
| Brief | Preview the actual message. If clipboard access fails, reveal and select text for manual copying. Explain that no message is sent automatically. |
| Search palette | Correct keyboard handling so Enter on the close button cannot execute a result. Combobox announces active result. Keep Home/End text editing and composition input intact. |
| Palette destinations | Include automation, packages, portfolio and individual services; open the requested disclosure and preserve its hash. |
| Existing shared anchors | Follow hash changes, reveal filtered automation before scrolling, and ignore malformed encoded fragments without crashing. |
| FAQ | Tolerate omitted Thai tone marks; add result count and a clear button. |
| Navigation | Close the menu when keyboard focus leaves it; show loading feedback while command search loads. |
| Mobile | Keep long English CTA text inside a single-column action group; 16px form text prevents iOS input zoom; readable dialog layout. |
| Destination pages | Respect the theme selected on the homepage, add section shortcuts, and collapse FAQ answers initially. |
| Full portfolio | Add an index of all 14 projects and direct links to screenshots and automation videos. |
| Missing page | Generate a branded 404 with useful homepage, portfolio and contact links; noindex it. |
| Focus/contrast preferences | Add explicit dialog/search focus states and forced-colors fallbacks. |

## Evidence and limits

Production build completed. The gallery and native image dialog were viewed while authoring. No automated test suite, exhaustive device testing, ranking measurement or conversion measurement was run. No paid service, tracking, submission endpoint or ad campaign was introduced. Existing owner-account decision for Search Console remains pending. Client screenshots and business claims were not invented.
