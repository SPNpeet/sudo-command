# Functional verification � 29 September 2026

Baseline live release: 0cdbd555f38ab87a1fdcaa63dab0f70c1ff621d8. This record describes actual checked paths, not a claim of 100% defect freedom or certification.

## Browser checks completed
- Three featured-project selectors show the corresponding title.
- Four work filters show 7+2, 4, 3 and 2 automation collections respectively.
- All seven project dialogs open with loaded images, lock background scrolling, support zoom, and close with Escape.
- All twelve reel selectors switch to their respective Facebook reel URL. Selection was tested; availability/playback within Facebook is subject to that service and was not re-certified here.
- All six service enquiry actions and three package actions set the expected brief option, navigate to contact and focus the business field.
- All thirteen FAQ disclosures open; unmatched search returns zero; clearing restores questions.
- All three need selectors change the recommendation.
- Search empty-state recovery restores nineteen actions; keyboard Enter on Contact closes search and routes to contact.
- Contact draft preserves Thai, English and reserved characters via encoded mailto. Copy reports success. Synthetic test text was cleared. No email or social message was sent.
- DOM audit found no broken homepage fragment targets, unnamed buttons or unsafe new-tab links.

- Thai and English checked at 320x568, 375x812, 768x1024, 1024x768, 1366x768 and 844x390 while disclosures were expanded: no document horizontal overflow. Menu opens within viewport and closes with Escape.

## Added release gate
Built static HTML local destinations and assets are checked with Python's HTML parser. Missing files/fragments, empty links and unsupported/insecure schemes fail verification. Five validator regression tests run in CI. Homepage React fragments are validated in the browser; external service responses are not represented as guaranteed by this checker.

## Limits still open
See it-audit-2026-09-29.md: unprotected main needs owner administrative access; private n8n runtime, account MFA and operational recovery need separate evidence. Real-device browser coverage is not implied by responsive viewport checks. No payment, message or external account side effects were triggered.
