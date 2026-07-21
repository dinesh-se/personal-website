# Feature Brief Session

**Feature:** Improve the site's visual theming (light/dark mode consistency, color palette, typography, spacing) and bring the app up to WCAG 2.1 AA accessibility standards (semantic HTML, color contrast, keyboard navigation, ARIA labels, focus states) across all pages.

### Feature Round 1 — dark-mode-strategy

**Q:** How should dark mode switching work on the site?
**A:** Manual toggle button + system preference as default

### Feature Round 2 — color-palette-scope

**Q:** What is the scope of the color palette overhaul?
**A:** Minor palette refinement (existing colors adjusted for contrast + consistency)

### Feature Round 3 — focus-management-scope

**Q:** Should advanced focus management be included?
**A:** Yes — skip navigation link, focus trap in mobile menu, focus restore on close

### Feature Round 4 — typography-system

**Q:** Should typography be changed from the current Tailwind defaults?
**A:** No — keep current Tailwind font utilities, just fix line-height and letter-spacing for readability

### Feature Round 5 — spacing-scale

**Q:** Should spacing be standardized with a new scale or refined from existing Tailwind utilities?
**A:** No — use existing Tailwind spacing, fix inconsistent spacing in components

### Consistency reconciliation

**Conflict:** tech-stack.md describes the dependency upgrade feature (Next.js 14→16, React 18→19, ESLint 8→9, Node 18→24) instead of the current visual theming & accessibility feature. All summary table rows, constraints, and methodology text reference the wrong feature.
**Decision:** Rewrite tech-stack.md to reflect the current feature (theming + a11y) — keep existing baseline stack entries, add axe-core as new dependency, remove dependency upgrade references
**Affects:** openspec/specs/tech-stack.md

### Consistency reconciliation

**Conflict:** architecture.md describes the dependency upgrade feature (Next.js 14→16, React 18→19, ESLint 8→9, Node 18→24) throughout all 8 sections. The current feature is visual theming and WCAG 2.1 AA accessibility. All section headers, upgrade impact notes, and constraints reference the wrong feature.
**Decision:** Rewrite architecture.md to reflect the current feature (theming + a11y) — update all 8 sections with dark mode, a11y, focus management, axe-core CI integration
**Affects:** openspec/specs/architecture.md

### Consistency reconciliation

**Conflict:** data-model.md intro, §1, §2, §3, §5 all describe the dependency upgrade feature (Next.js 16, React 19) instead of visual theming & a11y. Every 'This feature introduces no new entities' paragraph references the wrong feature.
**Decision:** Update data-model.md in-place: replace the feature description paragraphs while keeping the baseline type definitions intact
**Affects:** openspec/specs/data-model.md

### Consistency reconciliation

**Conflict:** api-spec.md §1-5 all reference 'the upgrade' (Next.js 16, React 19, graphql-request version bump) instead of the current theming & a11y feature. §3 incorrectly claims graphql-request version is bumped.
**Decision:** Rewrite api-spec.md to reflect the current feature — keep all baseline API specs, replace every 'upgrade' reference with 'visual theming & a11y' scope, remove graphql-request version bump claim
**Affects:** openspec/specs/api-spec.md

### Consistency reconciliation

**Conflict:** ux-spec.md §1, §3, §6 all say the feature upgrades core dependencies without adding pages, routes, or visual changes — but the current feature DOES add visual changes (dark mode toggle, color palette adjustments). §3 says components remain unchanged but Header gets a new toggle button. §6 says the upgrade doesn't modify Tailwind config but this feature changes darkMode from media to class.
**Decision:** Update ux-spec.md in-place: replace the feature impact paragraphs while keeping the baseline UI descriptions
**Affects:** openspec/specs/ux-spec.md

### Step 5 Approval

Decision: Changes requested
Feedback: T-003 (focus-trap-mobile-menu) has acceptance criteria AC-1 through AC-4 but no e2e spec was authored for it - only T-001, T-002, T-004, T-005, T-006, T-007, T-009 got specs (all prefixed c3-t-*). Please author e2e/c3-t-003-focus-trap-mobile-menu.spec.ts covering Tab/Shift+Tab focus cycling inside the open mobile menu, Escape closing it, and focus returning to the hamburger toggle on close. Also: e2e/dark-mode.spec.ts and e2e/skip-navigation.spec.ts are leftover duplicates from before a host interruption (they cover the same ground as c3-t-001-dark-mode-toggle.spec.ts and c3-t-002-skip-navigation-link.spec.ts, but with more test cases) - please reconcile by merging any test cases from the old files that aren't already in the c3-t-001/c3-t-002 versions, then delete the unprefixed duplicates.

### Step 5 Approval

Decision: Approved — 8 task(s)
