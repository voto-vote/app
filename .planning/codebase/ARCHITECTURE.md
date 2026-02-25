# Architecture

**Analysis Date:** 2026-02-25

## Pattern Overview

**Overall:** Next.js server-client hybrid with client-side state management via Zustand stores and server actions for data fetching.

**Key Characteristics:**
- Multi-language support with `next-intl` middleware-based routing
- Client-side state persistence using Zustand with localStorage
- Server-side data fetching via Next.js server actions
- Responsive React component hierarchy with Framer Motion animations
- PostgreSQL database with Drizzle ORM
- Calculation-heavy matching algorithm for election results

## Layers

**UI/Presentation Layer:**
- Purpose: Render interactive components with animations and responsive layouts
- Location: `src/app`, `src/components`
- Contains: Page components, layout files, UI components (buttons, dialogs, carousels)
- Depends on: Zustand stores, contexts, hooks, i18n
- Used by: End users via Next.js routes

**State Management Layer:**
- Purpose: Maintain client-side application state and persist to localStorage
- Location: `src/stores`
- Contains: Zustand store definitions for user ratings, entities, filters, UI state
- Depends on: Type definitions from `src/types`
- Used by: UI components and contexts

**Business Logic Layer:**
- Purpose: Calculate results, filter entities, manage application workflows
- Location: `src/lib` (utilities and calculators)
- Contains: `result-calculator.ts`, color utilities, URL utilities, API wrapper
- Depends on: Types, store selectors
- Used by: Components and server actions

**Data Fetching Layer (Server Actions):**
- Purpose: Fetch data from database and external APIs server-side
- Location: `src/actions`
- Contains: Functions marked with `"use server"` for elections, theses, candidates, parties
- Depends on: Database connection, Drizzle ORM, environment variables
- Used by: Pages and client components via async server calls

**Database Layer:**
- Purpose: Define schema and relations for election data
- Location: `src/db`
- Contains: Drizzle schema definitions, relations, connection setup
- Depends on: PostgreSQL
- Used by: Server actions

**Internationalization Layer:**
- Purpose: Handle multi-language routing and translation
- Location: `src/i18n`
- Contains: Routing configuration, locale utilities
- Depends on: `next-intl` library
- Used by: Middleware, components via hooks

**Context/Provider Layer:**
- Purpose: Share election data across subtree without prop drilling
- Location: `src/contexts`
- Contains: ElectionProvider, HeaderProvider for global context
- Depends on: Type definitions
- Used by: Layout components to wrap children

## Data Flow

**Election Selection and Setup:**

1. User arrives at `/[locale]` → `src/app/[locale]/(root)/page.tsx` (server component)
2. Server action `getElectionSummaries()` fetches available elections from database
3. `Elections` component renders list of election summaries
4. User clicks election → navigates to `/[locale]/elections/[electionid]/page.tsx`
5. Middleware (`src/middleware.ts`) validates election supports requested locale
6. Server action `getElection()` fetches full election config from database and object storage
7. `ElectionProvider` wraps children with election context
8. `ElectionLayout` component initializes Zustand stores and fetches theses/candidates/parties

**Thesis Rating and Live Results:**

1. User enters `/[locale]/elections/[electionid]/theses/page.tsx` (client component)
2. Component displays carousel of theses with `ThesisCard` components
3. User rates thesis (1-5 or skips) → `setUserRating()` updates `useUserRatingsStore`
4. Store updates trigger `useEffect` in layout that calls `calculateResults()`
5. Results are stored in `useResultStore` and displayed in `LiveMatches` component
6. User progresses through theses with break prompts every ~50%

**Result Display and Refinement:**

1. After all theses rated, user navigates to `/[locale]/elections/[electionid]/result/page.tsx`
2. `ResultPage` displays tabs for candidates/parties and their match percentages
3. Results sorted by match percentage descending
4. User can click individual entities to view detailed match breakdown
5. `ThesesList` tab shows which theses user favorited (starred)
6. User can view candidate/party detail page at `/[locale]/elections/[electionid]/result/(candidate-or-party)/candidates/[candidateid]/page.tsx`

**State Management:**

All state updates cascade through Zustand → React re-renders → matching algorithm recalculates:
- `userRatingsStore` updated → triggers `useEffect` in election layout
- Layout calls `calculateResults()` with election algorithm matrix
- Results stored in `resultStore` → propagates to all result display components
- Store state persisted to localStorage automatically via Zustand persist middleware

## Key Abstractions

**Election:**
- Purpose: Represents a complete election/voting session with metadata, algorithm config, and available entities
- Examples: `src/types/election.ts`
- Pattern: Immutable type fetched server-side, shared via context

**Thesis/Statement:**
- Purpose: Individual claim or proposal that users rate
- Examples: `src/types/theses.ts`
- Pattern: Fetched as array, displayed in carousel, ratings stored separately

**Entities (Candidate/Party):**
- Purpose: Entities being matched against user preferences
- Examples: `src/types/candidate.ts`, `src/types/party.ts`
- Pattern: Polymorphic union type handled in `src/types/entity.ts`

**Ratings:**
- Purpose: User's opinion on theses (0-100 scale) plus favorite flag
- Examples: `src/types/ratings.ts`
- Pattern: Nested object structure: `{ [electionId]: { [thesisId]: { rating, favorite, timestamp } } }`

**Result:**
- Purpose: Calculated match percentage for an entity against user's preferences
- Examples: `src/types/result.ts`
- Pattern: Computed via algorithm matrix, sorted by match percentage

**Zustand Store:**
- Purpose: Client-side reactive state with localStorage persistence
- Examples: `src/stores/user-ratings-store.ts`, `src/stores/result-store.ts`
- Pattern: Create typed store with state and actions, use in components via hooks

## Entry Points

**Web Entry Point:**
- Location: `src/app/[locale]/layout.tsx`
- Triggers: Browser requests to `http://domain/[locale]/path`
- Responsibilities: Set up HTML structure, load fonts, initialize NextIntlClientProvider

**Election Entry Point:**
- Location: `src/app/[locale]/elections/[electionid]/layout.tsx`
- Triggers: User navigates to election page
- Responsibilities: Initialize all Zustand stores, fetch theses/entities, set up result calculation

**Theses Page Entry Point:**
- Location: `src/app/[locale]/elections/[electionid]/(theses)/theses/page.tsx`
- Triggers: User begins rating theses
- Responsibilities: Display carousel, handle ratings, show live results

**Middleware Entry Point:**
- Location: `src/middleware.ts`
- Triggers: Every request (except API/static)
- Responsibilities: Handle i18n routing, validate election locale support, redirect if needed

**API Entry Point:**
- Location: `src/app/api/events/route.ts`
- Triggers: POST requests to `/api/events`
- Responsibilities: Proxy event data to external data sharing endpoint

## Error Handling

**Strategy:** Graceful degradation with fallbacks

**Patterns:**

- **Database errors:** Return `null` from server actions, caught in client as missing data
- **Image load failures:** Fall back to `/placeholder.svg` via `onError` handlers
- **Missing environment variables:** Log error at startup, return sensible defaults or skip feature (e.g., data sharing)
- **API failures:** Try-catch in server actions, return empty arrays for missing entities
- **Missing election locales:** Throw error in middleware to surface misconfiguration
- **Context not found:** Throw error from hook (`useElection()`) if used outside provider

## Cross-Cutting Concerns

**Logging:** Console logging via browser DevTools, server-side console during build/runtime

**Validation:**
- Type-level validation via TypeScript strict mode
- Runtime validation of election locales in middleware
- Entity filtering in result components

**Authentication:** Not implemented in current codebase (open voting system)

**Internationalization:**
- Middleware routes based on URL locale segment
- `next-intl` provides `useTranslations()` hook for component text
- Locale fallback chain: requested → supported → default
- Static translations in `messages` directory

**Performance:**
- Carousel lazy-loads theses progressively
- Result calculation cached in store, only recalculates when ratings change
- Images optimized via Next.js Image component
- Animations via Framer Motion (GPU-accelerated)

**Data Persistence:**
- User ratings persisted to localStorage via Zustand
- LocalStorage keys: `voto-ratings`, `voto-data-sharing`, `voto-bookmarks`, etc.
- Automatic JSON serialization/deserialization

**Event Tracking:**
- Optional data sharing to external endpoint via `EventsAPI.createEvent()`
- Events sent on `voto_started`, `voto_finished` with optional metadata
- Gated by `dataSharingEnabled` flag in store
