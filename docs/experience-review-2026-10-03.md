# Sudo experience review — 3 October 2026

## Changes

- Removed the remaining hero pause button. The client strip also has no pause or manual navigation buttons. System reduced-motion preferences remain supported.
- Brought the contact and portfolio actions ahead of the slideshow on mobile and kept both actions on one row.
- Stacked the tablet hero to prevent narrow columns and broken English words.
- Enlarged the real project window, removed its floating promotional stamp and made background layers decorative rather than misleading controls.
- Refined project thumbnails, captions, service disclosures, recommendation states, delivery, process, FAQ, contact, navigation and footer spacing.
- Made preview images readable at full panel width, with scroll containment, clearer controls and a prominent project enquiry action.
- Applied consistent typography, image proportions, jump links, contact actions and footer navigation to all generated service and portfolio pages.
- Replaced the portfolio's repeated full-width screenshot list with a responsive image gallery. Project previews sit beside their descriptions on desktop and stack on smaller screens.
- Corrected recommendation links to open their target service disclosure when pointing to a home-page anchor.
- Original Sudo and client identities remain intact. No new client claims, public system access, costs or integrations were introduced.

## Browser evidence

- Home at 320, 375, 430, 768, 1024 and 1280 CSS pixels: no horizontal overflow; visible controls outside closed disclosures have at least 44px targets (1px tolerance).
- All seven service destinations and portfolio at 375 and 768 CSS pixels: no horizontal overflow. At 375px there are no undersized visible controls or empty links.
- Thai/light and English/dark home views inspected; dark mobile preview inspected.
- Search for Google Sheets, Enter selection, disclosure opening and body scroll restoration verified.
- Service enquiry and package enquiry carry the chosen service to the brief and focus the business field.
- Preview opens, zooms, changes project, resets zoom and adds the selected project to the brief on enquiry.
- FAQ no-result state and clearing restore all 13 questions.
- Email drafts target supanut6420@gmail.com and include the entered brief. LINE links target nongpeetza. Clipboard copying succeeds. No message was sent during review.

## Release checks

Production build succeeds; existing security tests 9/9 and artifact tests 3/3 pass; 431 local references pass; dependency audit reports no vulnerabilities. Lint succeeds with two existing warnings. Browser evidence is desktop emulation, not physical-device testing or a compliance certification.
