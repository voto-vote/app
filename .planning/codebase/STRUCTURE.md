# Codebase Structure

**Analysis Date:** 2026-02-25

## Directory Layout

```
voto/app/
├── src/
│   ├── app/                          # Next.js app router (pages and layouts)
│   │   ├── [locale]/                 # Root layout with locale routing
│   │   │   ├── (root)/               # Route group for home page
│   │   │   ├── (header)/             # Route group for shared header
│   │   │   ├── elections/            # Election listing and detail pages
│   │   │   │   └── [electionid]/
│   │   │   │       └── (theses)/     # Route group for thesis and result pages
│   │   │   └── api/                  # API routes
│   │   │       └── events/           # Data sharing event endpoint
│   │   └── globals.css               # Global Tailwind styles
│   ├── components/                   # Reusable React components
│   │   └── ui/                       # Shadcn UI components
│   ├── contexts/                     # React Context providers
│   ├── stores/                       # Zustand state management
│   ├── lib/                          # Utilities and business logic
│   ├── db/                           # Database schema and connections
│   ├── types/                        # TypeScript type definitions
│   ├── actions/                      # Next.js server actions
│   ├── hooks/                        # Custom React hooks
│   ├── i18n/                         # Internationalization configuration
│   ├── middleware.ts                 # Next.js request middleware
│   └── inter.ttf                     # Custom font file
├── public/                           # Static assets
├── messages/                         # i18n translation files by locale
├── drizzle/                          # Database migrations
├── .env                              # Environment variables (not committed)
├── .env.example                      # Environment template
├── package.json                      # Project dependencies
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── drizzle.config.ts                 # Drizzle ORM configuration
└── vitest.config.mts                 # Testing framework configuration
```

## Directory Purposes

**src/app:**
- Purpose: Next.js App Router file structure mapping to URL routes
- Contains: Page components, layout components, API routes
- Key files: `page.tsx` (route endpoints), `layout.tsx` (nested layouts)
- Route structure mirrors URL paths with `[param]` for dynamic segments and `(group)` for route groups

**src/components:**
- Purpose: Reusable React components for rendering UI
- Contains: `animated-collapsible.tsx`, `markdown.tsx`, `responsive-dialog.tsx`, and UI primitives
- Key files: `ui/` subdirectory contains Radix UI and Shadcn components (Button, Dialog, Tabs, Carousel, etc.)

**src/contexts:**
- Purpose: React Context providers for shared state across component trees
- Contains: `election-context.tsx` (provides current election), `header-context.tsx` (header state)
- Pattern: Provider component wraps layout, hook exposes context value

**src/stores:**
- Purpose: Zustand client-side state stores with localStorage persistence
- Contains: Stores for user ratings, results, entities, UI state, bookmarks, data sharing
- Key files:
  - `user-ratings-store.ts`: Primary store tracking user's thesis ratings
  - `result-store.ts`: Calculated match results
  - `bookmark-store.ts`: User bookmarked candidates/parties
  - `data-sharing-store.ts`: Anonymous data sharing consent

**src/lib:**
- Purpose: Utility functions and business logic
- Contains:
  - `result-calculator.ts`: Core matching algorithm (calculateResults, convertDecisionToRating)
  - `color-utils.ts`: Color manipulation for dynamic theming
  - `api.ts`: Wrapper for external event API
  - `entity-utils.ts`: Candidate/party helpers
  - `url-utils.ts`: URL manipulation
  - `icons.ts`: Icon imports/exports
- Pattern: Pure functions exported for reuse across components

**src/db:**
- Purpose: Database schema and ORM setup
- Contains:
  - `schema.ts`: Drizzle table definitions (elections, candidates, parties, statements, votes)
  - `relations.ts`: Drizzle relationships between tables
  - `drizzle.ts`: Database connection and client initialization
- Pattern: Schema-first approach with Drizzle type inference

**src/types:**
- Purpose: TypeScript type definitions for domain objects
- Contains: Election, Candidate, Party, Thesis, Ratings, Result, etc.
- Key files:
  - `election.ts`: Complete election configuration
  - `entity.ts`: Polymorphic Candidate | Party union
  - `ratings.ts`: User rating structure
  - `api.ts`: Event API types
- Pattern: Discriminated unions where needed, avoid null where possible

**src/actions:**
- Purpose: Next.js server actions for data fetching and mutations
- Contains: Functions marked `"use server"` that run on server
- Key files:
  - `election-action.ts`: getElection() - fetches election config
  - `theses-action.ts`: getTheses() - fetches thesis statements
  - `candidate-action.ts`: getVotedCandidates() - fetches candidate data
  - `party-action.ts`: getVotedParties() - fetches party data
  - `election-summaries-actions.ts`: getElectionSummaries() - list view
- Pattern: Async functions returning typed data, cached via HTTP cache headers

**src/hooks:**
- Purpose: Custom React hooks for reusable component logic
- Contains: `use-breakpoint.ts`, `use-pointer.ts`
- Pattern: Encapsulate side effects and state management

**src/i18n:**
- Purpose: Multi-language support configuration
- Contains: Routing configuration, locale utilities
- Key files: `routing.ts` (supported locales, default locale), `utils.ts` (locale translation helpers)
- Pattern: Middleware-based routing with fallback chain

**messages/:**
- Purpose: Translation files organized by locale
- Contains: JSON translation keys for UI text
- Structure: `messages/[locale]/[namespace].json`
- Example: `messages/en/Election.json` contains election page translations

**drizzle/:**
- Purpose: Database migrations generated by Drizzle Kit
- Contains: `.sql` migration files
- Pattern: Auto-generated from schema changes

## Key File Locations

**Entry Points:**
- `src/app/[locale]/layout.tsx`: Root layout, sets up HTML, providers, header
- `src/middleware.ts`: Request middleware for i18n routing and validation
- `src/app/api/events/route.ts`: Data sharing event endpoint

**Configuration:**
- `package.json`: Dependencies, scripts
- `tsconfig.json`: TypeScript compiler options with `@/*` path alias
- `next.config.ts`: Next.js settings, i18n plugin
- `drizzle.config.ts`: Database connection and migration config
- `vitest.config.mts`: Test runner configuration
- `.env`: Environment variables (DATABASE_URL, OBJECT_STORAGE_URL, DATA_SHARING_ENDPOINT)

**Core Logic:**
- `src/lib/result-calculator.ts`: Matching algorithm implementation
- `src/stores/user-ratings-store.ts`: Central state for user preferences
- `src/stores/result-store.ts`: Calculated match results

**Data Access:**
- `src/actions/election-action.ts`: Main data fetch for election + config
- `src/db/schema.ts`: Complete database schema

**UI Structure:**
- `src/app/[locale]/elections/[electionid]/(theses)/theses/page.tsx`: Rating page
- `src/app/[locale]/elections/[electionid]/(theses)/result/page.tsx`: Results page
- `src/components/ui/carousel.tsx`: Thesis display carousel

## Naming Conventions

**Files:**
- Page components: `page.tsx` (Next.js convention)
- Layout components: `layout.tsx` (Next.js convention)
- Shared components: PascalCase, e.g., `ThesisCard.tsx`, `ResultList.tsx`
- Store files: kebab-case with `-store.ts` suffix, e.g., `user-ratings-store.ts`
- Action files: kebab-case with `-action.ts` suffix, e.g., `election-action.ts`
- Type files: kebab-case, e.g., `entity-filter.ts`
- Utility files: kebab-case with clear purpose, e.g., `color-utils.ts`
- Test files: Same name as source with `.test.ts` or `.spec.ts` suffix

**Directories:**
- Lower case, plural when containing multiple related items: `actions`, `stores`, `components`, `types`
- Singular for single concepts: `db`, `lib`, `i18n`, `middleware.ts`
- Route groups in parentheses: `(root)`, `(header)`, `(theses)`, `(candidate-or-party)`
- Dynamic segments in brackets: `[locale]`, `[electionid]`, `[candidateid]`

**Functions:**
- camelCase, verb-first for actions: `getElection()`, `setUserRating()`, `calculateResults()`
- Descriptive names for utilities: `convertDecisionToRating()`, `shuffle()`
- Hook names start with `use`: `useUserRatingsStore()`, `useElection()`, `useBreakpoint()`

**Types:**
- PascalCase: `Election`, `Candidate`, `Thesis`, `Result`, `Ratings`
- Discriminated union tags: lowercase, hyphenated: `"voto_started"`, `"voto_finished"`

**Stores:**
- Store names: `use[Feature]Store`, e.g., `useUserRatingsStore`, `useResultStore`
- State type: `State`
- Action type: `Action`
- Combined export: `State & Action`

## Where to Add New Code

**New Feature:**
- Primary code: `src/app/[locale]/elections/[electionid]/(theses)/[newfeature]/page.tsx`
- State management: `src/stores/[feature]-store.ts`
- Business logic: `src/lib/[feature]-utils.ts` if utility-heavy
- Tests: `src/lib/[feature].test.ts` colocated with implementation

**New Component/Module:**
- Standalone component: `src/components/[ComponentName].tsx`
- UI wrapper: `src/components/ui/[component].tsx`
- Page layout: `src/app/[locale]/[route]/layout.tsx`
- API route: `src/app/api/[endpoint]/route.ts`

**Server Action (Data Fetch):**
- Location: `src/actions/[entity]-action.ts`
- Pattern: Export async function marked `"use server"`
- Database access: Use `src/db/drizzle.ts` client
- Error handling: Try-catch returning null on failure

**Type Definition:**
- Shared domain types: `src/types/[entity].ts`
- API request/response: `src/types/api.ts`
- Pattern: Export type, use discriminated unions for variants

**Utility Function:**
- Shared utilities: `src/lib/[purpose]-utils.ts`
- Pure functions preferred
- Pattern: Export named functions, no side effects

**Custom Hook:**
- Location: `src/hooks/use-[feature].ts`
- Pattern: Use Zustand stores or React hooks internally
- Document with JSDoc comments

**Store/State:**
- Location: `src/stores/[feature]-store.ts`
- Pattern: Zustand with persist middleware for localStorage
- Typical structure:
  ```typescript
  type State = { /* data */ };
  type Action = { /* methods */ };
  export const use[Feature]Store = create<State & Action>()(
    persist(
      (set) => ({ /* state and actions */ }),
      { name: "voto-[feature]", storage: createJSONStorage(() => localStorage) }
    )
  );
  ```

## Special Directories

**src/app - Next.js App Router:**
- Purpose: File-based routing with automatic route generation
- Generated: No (hand-authored)
- Committed: Yes
- Pattern: `page.tsx` = route endpoint, `layout.tsx` = wraps children, `[param]` = dynamic segment

**src/components/ui - Shadcn Components:**
- Purpose: Reusable UI primitives
- Generated: By Shadcn CLI (shadcn-ui/ui library)
- Committed: Yes (copied to repo, not linked)
- Pattern: Component wrapper around Radix UI with Tailwind styling

**messages/ - i18n Translations:**
- Purpose: Multi-language strings
- Generated: No (hand-authored)
- Committed: Yes
- Structure: `messages/[locale]/[namespace].json`
- Example: `messages/de/Election.json` for German election translations

**.next - Build Output:**
- Purpose: Next.js compiled output and cache
- Generated: Yes (by `npm run build`)
- Committed: No (.gitignore)
- Pattern: Contains `server/` (backend), `.types/` (types), cache files

**node_modules:**
- Purpose: Installed dependencies
- Generated: Yes (by `npm install`)
- Committed: No (.gitignore)
- Pattern: Do not edit; update via `package.json`

**drizzle/ - Database Migrations:**
- Purpose: Track schema version history
- Generated: By `drizzle-kit generate`
- Committed: Yes
- Pattern: `.sql` files numbered chronologically
