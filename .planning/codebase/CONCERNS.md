# Codebase Concerns

**Analysis Date:** 2026-02-25

## Tech Debt

**Incomplete Election Configuration Implementation:**
- Issue: `private` and `matchFields` properties are hardcoded as placeholder values with TODO comments, never populated from actual configuration
- Files: `src/actions/election-action.ts` (lines 92-93)
- Impact: Elections cannot be marked as private, and match field filtering is disabled. Feature is non-functional.
- Fix approach: Extend election configuration schema to include these fields, update convertors to extract from configuration object

**Outdated Redirect Still in Production:**
- Issue: Redirect from old `/app/:id` route to new `/elections/:id` is still active with TODO comment indicating it should be removed
- Files: `next.config.ts` (line 22-30)
- Impact: Maintains backwards compatibility but adds unnecessary routing overhead. Technical debt from migration.
- Fix approach: Monitor usage metrics, remove redirect once old URLs are no longer indexed or used

**Unsafe String Replacements for URL Construction:**
- Issue: Multiple locations use string `.replace()` with hardcoded "voto://" protocol without validation that the value contains the protocol
- Files: `src/actions/election-action.ts` (line 80), `src/actions/election-summaries-actions.ts` (line 49), `src/actions/party-action.ts` (lines showing image URL construction)
- Impact: If external configuration provides unexpected URL schemes, replacements may fail silently or produce malformed URLs
- Fix approach: Use URL parsing and validation throughout, or require configuration validation at ingestion time

## Known Bugs

**localStorage Hydration Mismatch Risk:**
- Symptoms: Zustand stores using localStorage persistence may cause hydration mismatches on SSR pages if not properly initialized
- Files: `src/stores/data-sharing-store.ts`, `src/stores/user-ratings-store.ts`, `src/stores/bookmark-store.ts`, `src/stores/intro-store.ts`, `src/stores/random-store.ts`, `src/stores/survey-store.ts`
- Trigger: Navigation between pages or server-side rendering context changes
- Workaround: Stores appear to be used only on client components ("use client"), but edge cases with navigation could cause issues

**parseInt Without Radix on Dynamic Input:**
- Symptoms: URL parameter parsed as electionId with `parseInt(id)` without radix argument
- Files: `src/actions/election-action.ts` (lines 24, 29, 43)
- Trigger: Passing election IDs starting with "0x" or other unexpected formats
- Workaround: Current usage unlikely to expose this (controlled API), but best practice is to use `parseInt(id, 10)`
- Recommendation: Add `parseInt(id, 10)` consistently across codebase

**Missing Error Boundary on Configuration Fetch:**
- Symptoms: If external configuration JSON fetch fails, election page returns null but user sees no error
- Files: `src/actions/election-action.ts` (lines 48-62)
- Trigger: Configuration endpoint is down, returns invalid JSON, or network error
- Workaround: Page gracefully degrades to homepage, but user has no visibility into failure cause

**XSS Risk in Markdown Component:**
- Symptoms: Markdown content is converted to HTML and rendered with `dangerouslySetInnerHTML`
- Files: `src/components/markdown.tsx` (line 25)
- Risk: If markdown content comes from untrusted sources (external configuration, user input), could enable XSS attacks
- Current mitigation: Content comes from trusted configuration source, remark library provides some sanitization
- Recommendation: Add DOMPurify or similar HTML sanitization before rendering if source becomes untrusted

## Security Considerations

**Environment Variable Validation at Runtime:**
- Risk: Multiple environment variables (`DATABASE_URL`, `OBJECT_STORAGE_URL`, `DATA_SHARING_ENDPOINT`) are accessed without checks or default values
- Files: `src/db/drizzle.ts` (line 6), `src/actions/election-action.ts` (lines 15-18), `src/actions/election-summaries-actions.ts` (lines 13-16), `src/app/api/events/route.ts` (lines 6-10)
- Current mitigation: Some throw errors if missing, some skip gracefully. Inconsistent approach.
- Recommendation: Create centralized environment validation at startup, fail fast if critical vars are missing

**Database Connection Pool Not Explicitly Managed:**
- Risk: Global `db` connection pool is created once but never explicitly closed
- Files: `src/db/drizzle.ts`
- Impact: Potential connection leaks on serverless cold starts, graceful shutdown not guaranteed
- Recommendation: Implement proper connection pool lifecycle management or use connection pooling service (PgBouncer, etc.)

**Loose Type Casting in Conversion Functions:**
- Risk: Status number mappings may receive unexpected values and fall back to default without logging
- Files: `src/actions/candidate-action.ts` (lines 114-122), `src/actions/party-action.ts` (lines 69-76)
- Impact: Silent failures if database schema changes or corrupts status values. Status becomes "created" by default.
- Recommendation: Log warnings when falling back to defaults, validate status values come from expected set

## Performance Bottlenecks

**Quadratic Promise.all() with Configuration Fetches:**
- Problem: Election summaries fetches configuration for EACH election instance sequentially in Promise.all()
- Files: `src/actions/election-summaries-actions.ts` (lines 34-61)
- Cause: Each election requires separate fetch to object storage endpoint. With 100 elections, 100+ HTTP requests.
- Impact: Page load time scales linearly with election count. High latency on slow networks.
- Improvement path: Implement batch configuration fetch endpoint, add caching with Redis/CDN, or fetch configurations on-demand client-side

**Large Component Re-renders Without Memo:**
- Problem: Several large components (393 lines, 383 lines, 352 lines) may re-render entirely on state changes
- Files: `src/app/[locale]/elections/[electionid]/page.tsx`, `src/app/[locale]/elections/[electionid]/(theses)/result/filter-dialog.tsx`, `src/app/[locale]/elections/[electionid]/(theses)/theses/page.tsx`
- Cause: No React.memo() or useMemo() optimization visible in reviewed code
- Impact: Unnecessary re-renders of large UI trees during carousel scrolls, state updates
- Improvement path: Profile with React DevTools, wrap large components with React.memo, memoize expensive selectors

**Set Mutation in State Updates:**
- Problem: `expandedParticipantExplanations` uses mutable Set operations (`newSet.add()`, `newSet.delete()`)
- Files: `src/app/[locale]/elections/[electionid]/(theses)/result/thesis-result-card.tsx` (lines 172-175 approx)
- Impact: React may not detect state changes properly, could skip renders or cause re-render loops
- Improvement path: Use immutable patterns: `new Set([...newSet, id])` or `[...newSet].filter(x => x !== id)`

**Middleware Calls getElection on Every Request:**
- Problem: Middleware fetches full election data for every route request to validate locales
- Files: `src/middleware.ts` (line 14)
- Cause: No caching layer - database queries on every page load, locale redirect, API call
- Impact: Database connection pool depletion, elevated latency on every page transition
- Improvement path: Implement server-side cache (Redis) for election locale support, use time-based invalidation

## Fragile Areas

**Filter Dialog State Synchronization:**
- Files: `src/app/[locale]/elections/[electionid]/(theses)/result/filter-dialog.tsx` (383 lines)
- Why fragile: Manages temporary filter state (`tmpFilters`) that syncs with global store on open/close. Complex re-sync logic in useEffect (lines 44-50).
- Safe modification: Any changes to filter condition functions or store structure require careful testing of open/close cycles. Add unit tests for filter state edge cases.
- Test coverage: No visible tests for filter dialog behavior

**Theses Page State Management:**
- Files: `src/app/[locale]/elections/[electionid]/(theses)/theses/page.tsx` (352 lines)
- Why fragile: Manages 6+ useState hooks (carousel API, current index, live matches visibility, break drawer). Multiple useEffects with dependencies on `userRatings` and `election.id`. Carousel API initialization is async.
- Safe modification: Changes to rating or favorite logic must account for all state transitions. Race conditions possible if updates happen during carousel re-mounting.
- Test coverage: No test visible

**Thesis Result Card Complex State:**
- Files: `src/app/[locale]/elections/[electionid]/(theses)/result/thesis-result-card.tsx` (290 lines)
- Why fragile: Manages expanded state, participant explanations Set, change rating dialog. Complex conditional rendering with multiple animation states.
- Safe modification: Changes to Set mutations will break React re-renders. AnimatePresence depends on isExpanded state timing.
- Test coverage: No tests visible

**Election Action with Multiple Concurrent Promises:**
- Files: `src/actions/election-action.ts` (174 lines)
- Why fragile: Promise.all() with database queries and external fetch to configuration endpoint. If configuration fetch is slow/fails, entire election load fails silently.
- Safe modification: Any changes to error handling must ensure all 4 promises are handled consistently. Adding new data sources requires careful error propagation.
- Test coverage: No error case tests visible

## Scaling Limits

**Database Connection Pool Default Size:**
- Current capacity: Default postgres pool size (typically 10 connections)
- Limit: With middleware calling getElection on every request, production deployment could exhaust connection pool
- Files: `src/db/drizzle.ts`
- Scaling path: Increase `max` pool size in drizzle config, implement connection pooling middleware (PgBouncer), cache election locale support

**External Configuration Endpoint Rate Limiting:**
- Current capacity: No visible retry logic, no rate limit handling
- Limit: Election summaries page fetches N configurations in parallel. Many concurrent users could trigger rate limiting on object storage endpoint.
- Files: `src/actions/election-summaries-actions.ts`
- Scaling path: Implement exponential backoff, add circuit breaker pattern, batch configuration requests, cache with CDN

**Zustand Store with localStorage on Large Datasets:**
- Current capacity: User ratings stored per election, all in one localStorage entry
- Limit: With thousands of theses per election and multiple elections, localStorage could hit 5-10MB limit
- Files: `src/stores/user-ratings-store.ts`
- Scaling path: Implement data retention policy (keep last N ratings), use IndexedDB instead, sync to backend periodically

## Dependencies at Risk

**Framer Motion Animation Library:**
- Risk: Large library (1000+ lines) used for simple animations. Could impact bundle size and time-to-interactive
- Impact: Every result page, thesis card, carousel uses framer-motion animations. Performance regression on low-end devices.
- Alternative: Consider CSS-only animations for simple expand/collapse (used via AnimatePresence), or smaller library like Popmotion

**Next.js 15.5.2 Turbopack (Experimental):**
- Risk: Turbopack is still in development, may have bugs or performance regressions
- Files: `package.json` scripts use `--turbopack` flag
- Impact: Build failures, unexpected compilation issues, performance regression
- Recommendation: Monitor Vercel's Turbopack roadmap, have fallback to standard webpack build ready

**Drizzle ORM Versioning Strategy:**
- Risk: Drizzle 0.44.5 is pre-1.0, may introduce breaking changes in minor versions
- Impact: Unexpected API changes, schema migrations could break
- Recommendation: Pin to exact version in production, monitor changelog, plan for migration to 1.0

## Missing Critical Features

**No Form Validation on Survey URLs:**
- Problem: Survey URLs accepted from configuration without validation
- Files: `src/app/[locale]/elections/[electionid]/survey-dialog.tsx` (line 78-79)
- Impact: Invalid or malicious URLs could be embedded in elections, could cause security issues or broken surveys
- Blocks: Safe survey feature deployment

**No User Input Validation:**
- Problem: Filter search input, election IDs from URL params, configuration data all accepted without schema validation
- Impact: Unexpected data types could cause runtime errors, security issues
- Blocks: Robust data handling, security compliance

**No Analytics or Event Tracking:**
- Problem: No visibility into user behavior, feature usage, errors in production
- Impact: Cannot diagnose issues, cannot optimize features, cannot detect abuse
- Blocks: Production observability

## Test Coverage Gaps

**No Tests for Error Scenarios:**
- Untested: Configuration fetch failure, database unavailable, invalid IDs, network errors
- Files: All server actions (`src/actions/*.ts`) and API routes (`src/app/api/**`)
- Risk: Error handling code path untested, could fail silently or with poor UX
- Priority: High - production app without error case testing is risky

**No Tests for State Synchronization:**
- Untested: Filter dialog open/close, theses carousel state transitions, rating updates with live matches
- Files: `src/app/[locale]/elections/[electionid]/(theses)/result/filter-dialog.tsx`, `src/app/[locale]/elections/[electionid]/(theses)/theses/page.tsx`
- Risk: Race conditions, state divergence not caught until user reports bug
- Priority: High - complex state management needs test coverage

**No Tests for Locale/i18n:**
- Untested: Locale switching, unsupported locale fallback, election-specific locale filtering
- Files: `src/middleware.ts`, `src/i18n/**`, page components with `useLocale()`
- Risk: Locale mismatch bugs, silent failures in unsupported locales
- Priority: Medium - could impact international users

**No Tests for localStorage/Zustand Stores:**
- Untested: Store persistence, hydration, concurrent updates from multiple tabs
- Files: All store files in `src/stores/`
- Risk: Data loss, hydration mismatches, stale data across tabs
- Priority: Medium - affects user experience with state persistence

**No Integration Tests:**
- Untested: End-to-end flows like: load election → view theses → submit ratings → see results
- Impact: Cannot verify features work together correctly
- Priority: Medium - critical for feature validation

---

*Concerns audit: 2026-02-25*
