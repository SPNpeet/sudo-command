# Security of Sudo Command

## Scope
The supported public site is the current main branch at https://spnpeet.github.io/sudo-command/. It is a static portfolio, not an authenticated app or the n8n/GoldVideo production backend.

## Report a concern
Email sudocoffee.home@gmail.com with the affected URL, observed behaviour, impact and minimal reproduction. Do not include passwords, tokens, customer records or publish an exploitable issue publicly. This mailbox is the existing business contact; no response-time guarantee is claimed.

## Maintainer procedure
1. Record the report privately, assess impact and assign the site owner. Preserve necessary evidence without secrets.
2. If credentials are involved, revoke/rotate at the issuer; removing a file is not sufficient. Review repository history and provider logs.
3. Prepare a branch and PR. Review the diff, dependency changes and public artifacts. Run the verification pipeline. Owner approval or the owner's explicit deployment instruction authorizes release; independent review is preferable and is not enforced by these files.
4. Merge only a passing verified revision. Check the Pages deployment for that exact commit, then test the live homepage, search, preview, static pages and contact links.
5. Record resolution and notify the reporter when appropriate. Review the risk register after any incident.

## Rollback
Use a new revert commit/PR for the offending change; do not force-push or erase audit history. Re-run verification and redeploy the restored revision. If the verification infrastructure itself is broken, repair it through a reviewed PR before release. Previous code is in Git; there is no user database on this site. No recovery time is promised until a timed exercise has been completed.

## Routine review
Review Dependabot PRs and vulnerability findings weekly; updates are not automatically merged. Recheck access, MFA, recovery arrangements and hosting constraints quarterly and after ownership/hosting changes. These are recommended operating procedures, not evidence they have already been performed.
