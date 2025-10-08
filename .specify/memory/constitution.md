<!--
Sync Impact Report
Version change: N/A → 1.0.0
Modified principles:
- PRINCIPLE_1_NAME → Accessibility & Inclusive Media
- PRINCIPLE_2_NAME → Simplicity & Performance Budget
- PRINCIPLE_3_NAME → Content Authenticity & Consent
- PRINCIPLE_4_NAME → Attribution & Transparency
- PRINCIPLE_5_NAME → Preview & Publish Checks
Added sections:
- Content Licensing & Rights
- Development Workflow & Review Gates
Removed sections:
- None
Templates requiring updates:
- [.specify/templates/plan-template.md](.specify/templates/plan-template.md): ✅ updated — footer references Constitution v1.0.0 and Constitution Check maps to the five principles
- [.specify/templates/spec-template.md](.specify/templates/spec-template.md): ✅ aligned — generic gates remain compatible
- [.specify/templates/tasks-template.md](.specify/templates/tasks-template.md): ✅ aligned — TDD and completeness checks align with Governance
Follow-up TODOs:
- TODO(CODE_LICENSE): select code license (e.g., MIT/Apache-2.0/GPL-3.0)
- TODO(DJ_LICENSE): define DJ mixes license (e.g., streaming-only with tracklists; clarify reuse)
- TODO(DATA_LICENSE): choose data artifacts license (e.g., CC BY 4.0/CC0)
-->

# JoJo Portfolio Constitution

## Core Principles

### Accessibility & Inclusive Media
Portfolio content MUST be perceivable, operable, understandable, and robust:
- All images MUST include accurate alt text; decorative images MUST use empty alt.
- Color contrast MUST meet WCAG 2.2 AA; keyboard navigation MUST be complete.
- Videos or audio embeds SHOULD include captions or transcripts where feasible.
Rationale: Accessibility expands reach, reflects professional standards, and is
non-negotiable for an inclusive portfolio across photography, code, data, and DJ sets.

### Simplicity & Performance Budget
The site MUST remain fast and simple to maintain:
- Photos served as WebP with lazy loading by default; provide srcset for responsive sizes.
- p95 LCP on mobile < 2.5s; CLS < 0.1; avoid layout shifts from media.
- Keep pages minimal: defer non-critical scripts; avoid heavy frameworks unless justified.
Rationale: Simplicity improves reliability; performance ensures images and media
load quickly on typical mobile networks without sacrificing quality.

### Content Authenticity & Consent
Only publish content with clear rights and consent:
- Photos: publish only with model/location releases when required; no third‑party rights violations.
- DJ mixes: include complete tracklists; avoid distributing full copyrighted tracks.
- Data work: anonymize or aggregate sensitive data; include data sources and limitations.
Rationale: Respect for subjects, artists, and data ethics protects both audiences
and the portfolio owner while maintaining professional integrity.

### Attribution & Transparency
Credit collaborators, sources, and tools:
- Include visible credits for featured artists, models, assistants, and venues.
- List libraries/datasets used in code/data work; link to sources when possible.
- Maintain a change log for substantive edits to published media or write‑ups.
Rationale: Clear attribution builds trust and demonstrates professional standards.

### Preview & Publish Checks
No content goes live without passing pre‑publish checks:
- Accessibility audit: alt text, contrast, keyboard traps, focus order.
- Performance audit: image sizes, lazyload behavior, LCP/CLS budgets.
- Licensing review: rights and consent verified per Section "Content Licensing & Rights".
- Cross‑device sanity: mobile and desktop preview for layout and media playback.
Rationale: A lightweight gate prevents regressions and protects rights prior to publish.

## Content Licensing & Rights
This portfolio covers photography, code projects, data analysis, and DJ mixes.
The default and exceptions are defined below.

- Photography: All Rights Reserved. Contact required for any usage beyond site display.
  Watermarks MAY be used on public galleries; downloads MAY be disabled.
- Code: TODO(CODE_LICENSE): Choose a code license (e.g., MIT for permissive use).
- DJ mixes/sets: TODO(DJ_LICENSE): Define streaming rules and redistribution policy.
- Data analysis artifacts (notebooks, datasets, reports): TODO(DATA_LICENSE): Choose
  an appropriate open license (e.g., CC BY 4.0) or restrict if required by source.
- Third‑party content: Ensure fair use or explicit permission; keep records of approvals.

Compliance Rules:
- Every item MUST state its license or inherit the defaults above.
- Tracklists MUST accompany DJ mixes; rights inquiries documented upon request.
- Sensitive data MUST be handled per "Content Authenticity & Consent".

## Development Workflow & Review Gates
Use the repository templates for planning and execution:
- Plan and design documents MUST include a Constitution Check mapping to the
  five Core Principles above.
- A pre‑publish checklist MUST be run for any new or materially changed content.
- Automation MAY assist checks, but human review is REQUIRED before publish.

Alignment with templates:
- [.specify/templates/plan-template.md](.specify/templates/plan-template.md): Constitution Check gate applies these five principles.
- [.specify/templates/spec-template.md](.specify/templates/spec-template.md): Remains principle‑agnostic and compatible.
- [.specify/templates/tasks-template.md](.specify/templates/tasks-template.md): TDD ordering aligns with Governance requirements.

## Governance
- Authority: This Constitution governs content and process for JoJo Portfolio.
- Amendments: Open a PR describing proposed changes, rationale, and migration plan.
  Owner approval REQUIRED. On merge, bump version per policy below and update dates.
- Versioning Policy: Semantic versioning for governance text.
  - MAJOR: Backward‑incompatible changes to principles or removals.
  - MINOR: New principle/section or materially expanded guidance.
  - PATCH: Clarifications, wording, or non‑semantic refinements.
- Compliance Reviews: All PRs and publish actions MUST verify adherence to Core
  Principles, Licensing & Rights, and Workflow gates. Violations require explicit
  justification and a plan to remediate before merge or publish.

**Version**: 1.0.0 | **Ratified**: 2025-10-04 | **Last Amended**: 2025-10-04