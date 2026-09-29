# Editorial refinement — 29 September 2026

## Reference observations
- https://koto.com/ — restrained navigation and large type; studied the actual home page. Some hero media did not render in the research browser.
- https://locomotive.ca/en — full-bleed imagery, strong type hierarchy and a compact navigation layer; actual home page viewed.
- These are design references, not claims that either won a 2026 annual award. Prior dated award research remains in award-study-2026.md.

## Applied to Sudo
- Noninteractive client signatures: original colours, no arrows, hover motion or false click affordance.
- Less framing around real project screenshots and the motion archive.
- A distinct recommendation panel with explicit context and a quiet index.
- Open services get a clear surface and expanded control state.
- A typographic contact introduction, clearer brief entry and persistent desktop contact details.
- Search dialog explicitly releases the modal before restoring trigger focus. Ignore delayed native close events when StrictMode has reopened it.
- Existing original Sudo logo, orange identity, links, real work and free hosting retained.

## Checks
- Build succeeds. Lint succeeds with two pre-existing warnings (RoiCalc and ServiceVisuals).
- TH and EN: actual viewport widths 320, 375, 430, 768, 1024, 1366, 1920, plus 844 x 390 landscape. No document horizontal overflow.
- TH rendered controls outside closed disclosures have at least 44px targets (1px tolerance).
- Client section contains zero links/buttons. Desktop, mobile recommendation and tablet work visually inspected.
- Search opens; Escape closes; trigger focus returns and body scrolling unlocks.
- No real-device Safari or Android hardware testing claimed.
