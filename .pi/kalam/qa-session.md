
# Feature Brief Session
**Feature:** Upgrade core dependencies to their latest stable versions: Next.js 14 to 16, React 18 to 19, @vercel/analytics 1 to 2, and any other outdated packages. Bump the CI workflow's Node version to match the local dev environment (currently pinned to Node 18 in CI, but local dev uses Node 24). Goal is a clean, working upgrade with no regressions, so the e2e/unit test harness from the previous cycle can be used with confidence on a modern stack.

### Feature Round 1 — next-version
**Q:** Next.js 14 → 16: Next.js 15 and 16 have significant differences (App Router changes, Turbopack defaults, new image/headers APIs). Which target do you want?
**A:** Next.js 16 (latest stable, may have newer features)

### Feature Round 2 — node-version
**Q:** CI uses Node 18 (setup-node@v2 with node-version: '18'). Local dev uses Node 24. What Node version should CI target?
**A:** Node 24 (match local dev)

### Feature Round 3 — react-version
**Q:** React 18 → 19: React 19 has breaking changes (removed PropTypes, new hooks API, automatic batching changes, context updates). Which target?
**A:** React 19 (latest stable)

### Feature Round 4 — breaking-changes
**Q:** React 19 and Next.js 15/16 have breaking changes. How should known incompatibilities be handled?
**A:** Upgrade with audit: npm audit fix, fix TypeScript errors, run tests, fix failures one-by-one

### Feature Round 5 — eslint-update
**Q:** ESLint 8 (legacy .eslintrc.json) → ESLint 9 (flat config eslint.config.js). Next.js 16's eslint-config-next likely requires ESLint 9. Which path?
**A:** ESLint 9 with flat config (full migration)

### Feature Round 7 — other-deps
**Q:** Beyond the explicitly mentioned upgrades, which other direct dependencies should be bumped to latest stable in this same PR?
**A:** All direct dependencies to latest stable

### Step 5 Approval
Decision: Approved — 9 task(s)
