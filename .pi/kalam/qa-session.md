
# Feature Brief Session
**Feature:** "Re-architect to current Next.js 16 App Router standards/patterns: move all Hygraph + Dev.to fetching into Server Components (App Router data model); add per-route loading.tsx + error.tsx (streaming + Suspense boundaries); adopt Cache Components (use cache / cacheLife) + Partial Prerendering for cached remote data; upgrade Next to 16.3+ as the prerequisite; migrate to generateMetadata Metadata API + typed routes; fix Experience formatDate DD/MM/YYYY bug. No visual redesign, no new pages; keep Hygraph/Dto as the data sources."

### Feature Round 1 — loading-state-pattern
**Q:** What loading state pattern should per-route loading.tsx use?
**A:** Skeleton loaders

### Feature Round 2 — error-handling-strategy
**Q:** What error handling strategy should be adopted for error.tsx files?
**A:** Hybrid: root + per-route

### Feature Round 3 — cache-strategy
**Q:** What caching strategy should be used for remote data (Hygraph + Dev.to)?
**A:** Default cacheLife profiles

### Feature Round 4 — partial-prerendering
**Q:** Should Partial Prerendering (PPR) be adopted alongside ISR for cached remote data?
**A:** Yes — adopt PPR

### Feature Round 5 — metadata-api-migration
**Q:** Should all routes migrate from static metadata exports to generateMetadata?
**A:** Yes — generateMetadata on all routes

### Feature Round 7 — experience-formatdate-fix
**Q:** What date format should the Experience component use? Currently it shows "May 2023" (month name + year).
**A:** MMM YYYY (keep current format)
