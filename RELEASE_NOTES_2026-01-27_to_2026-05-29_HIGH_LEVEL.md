# Release Notes (High-Level)

## Scope

- Repository: pagopa-cruscotto-frontend
- Period covered: 2026-01-27 to 2026-05-29
- Source: git history since 2026-01-27

## Change Summary

- Major frontend evolution for report lifecycle features: report download, polling stabilization, filename/status handling, and UX error management improvements.
- Archive/restore instance capabilities were introduced and iteratively refined, including CTA behavior, status checks, and user-facing error messaging.
- Authentication migrated to MSAL/SSO: login flow redesign, silent SSO and token refresh handling, route cleanup, and legacy JWT logic removal.
- Environment and deployment hardening included repeated fixes to env files, redirect URIs, dev build/release pipeline settings, and multi-environment configurations.
- Test-user access support was expanded with dedicated login/token handling and follow-up token refresh updates.
- New product surface was added with the operations search section and work-in-progress on the posizioni debitorie section.

## Key Areas Affected

- Reporting UX: asynchronous report generation and status polling reliability.
- Instance management: archive and restore actions, validations, and error display behavior.
- Security and access: MSAL integration, SSO, token lifecycle management, login flow simplification.
- Configuration and delivery: environment configuration consistency, CI/CD release flow stability.
- Functional expansion: new UI areas for operations search and debt-position related capabilities.

## Delivery Metrics

- Total commits in range: 139
- Merge/PR commits: 45
- Automated version-bump commits: 34
- Non-merge, non-version-bump commits: 59
- Unique non-merge change subjects: 53

## Notes

- This is a stakeholder-oriented summary and intentionally excludes commit-by-commit details.
- If needed, a detailed changelog version can be generated for full technical traceability.
