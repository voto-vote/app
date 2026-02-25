# External Integrations

**Analysis Date:** 2026-02-25

## APIs & External Services

**Data Sharing Service:**
- Event sharing endpoint for election data and user interactions
  - Endpoint: Configurable via `DATA_SHARING_ENDPOINT` environment variable
  - Integration point: `src/app/api/events/route.ts` (POST handler)
  - Client: `src/lib/api.ts` (EventsAPI class)
  - Usage: Creates events with election and user interaction data
  - Protocol: REST API with JSON payloads
  - Events payload: Discriminated union type from `src/types/api.ts`

**Object Storage Service:**
- Static asset and configuration storage
  - Base URL: Configurable via `OBJECT_STORAGE_URL` environment variable
  - Files stored: Election configuration JSON files
  - Path pattern: `/configuration/{instanceId}/configuration.json`
  - Integration points:
    - `src/actions/election-action.ts` - Fetches configuration for elections
    - `src/actions/candidate-action.ts` - Fetches asset URLs
    - `src/actions/party-action.ts` - Fetches party branding assets
    - `src/actions/election-summaries-actions.ts` - Fetches election background images
  - Usage: Configuration files and media assets (images, backgrounds)
  - URL rewriting: URLs with `voto://` protocol are rewritten to object storage URLs

## Data Storage

**Databases:**
- PostgreSQL (primary)
  - Connection: Via `DATABASE_URL` environment variable
  - Client: `pg` 8.16.3 package (Node.js Pool)
  - ORM: Drizzle ORM 0.44.5
  - Connection pool configured in `src/db/drizzle.ts`
  - Schema location: `src/db/schema.ts`

**Database Tables:**
- `statements` - Questions/theses for voter comparison
- `statement_translations` - Multi-language versions of statements
- `elections` - Election metadata and status
- `instances` - Individual election instances with localization
- `candidates` - Candidate profiles with party affiliation
- `candidate_votes` - Candidate positions on statements
- `parties` - Political party information
- `party_votes` - Party positions on statements
- `candidates_light` - Simplified candidate records
- `users` - User profiles (candidate/party contacts)
- `admins` - Administrator accounts
- `creators` - Election creator accounts
- `party_agents` - Party representative accounts
- `genders` - Gender reference data
- `notifications` - Election-related notifications
- `exp_theses`, `exp_theses_translation`, `exp_app_theses` - Experimental thesis/statement features

**File Storage:**
- Local filesystem only - No separate file storage service integration
- Profile pictures stored via object storage URLs: `src/db/schema.ts` line 368 `profilePicture` field

**Caching:**
- Client-side state via Zustand stores with localStorage persistence:
  - `src/stores/bookmark-store.ts` - Bookmarked parties and candidates (Zustand with persist middleware)
  - `src/stores/survey-store.ts` - User responses during survey (localStorage backed)
  - `src/stores/user-ratings-store.ts` - User's statement ratings
  - Other stateless stores: party, candidate, result, entity-filter, etc.
- No server-side caching layer detected

## Authentication & Identity

**Auth Provider:**
- Custom/external - No built-in authentication system
  - User roles are database-based: admins, creators, party_agents, users
  - No OAuth/SSO integration detected
  - No session management or login endpoint in API routes
  - Middleware: `src/middleware.ts` handles i18n routing only, not auth

**User Management:**
- User accounts stored in PostgreSQL `users` table
- Role assignments via dedicated tables: `admins`, `creators`, `party_agents`
- No visible authentication flow in frontend code

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, Rollbar, or similar integration

**Logs:**
- Browser console: `console.error()` calls in `src/lib/api.ts`
- Docker logging: Standard output from Node.js process
- No structured logging framework (winston, pino, etc.) detected
- Next.js telemetry disabled: `NEXT_TELEMETRY_DISABLED=1`

## CI/CD & Deployment

**Hosting:**
- Docker containerized application
- Container image: Node.js 24-alpine base
- Output mode: Standalone (Next.js standalone output)
- Port: 3000 (NODE_PORT environment variable)

**CI Pipeline:**
- GitHub Actions workflows present in `.github/workflows/` directory
- Specific workflows not analyzed (directory exists but contents not read)

**Build Process:**
```
npm ci → npm run build (next build --turbopack) → Docker image creation
```

## Environment Configuration

**Required env vars:**
- `DATABASE_URL` - PostgreSQL connection string (format: `postgres://username:password@host/db`)
- `OBJECT_STORAGE_URL` - Base URL for static assets and configuration (format: `https://your-object-storage-url`)
- `DATA_SHARING_ENDPOINT` - External data sharing service endpoint (format: `https://your-data-sharing-endpoint`)

**Optional env vars:**
- `NODE_ENV` - Set to `production` in Docker (default: development)
- `NEXT_TELEMETRY_DISABLED` - Set to `1` to disable Next.js telemetry
- `PORT` - Server port (default: 3000)
- `HOSTNAME` - Server hostname (default: `0.0.0.0`)

**Secrets location:**
- `.env` file at project root (not committed, excluded by `.gitignore`)
- Marked as forbidden from reading due to containing credentials

## Webhooks & Callbacks

**Incoming:**
- POST `/api/events` - Event creation endpoint
  - Receives event data from frontend components
  - Forwards to `DATA_SHARING_ENDPOINT/events`
  - Used for tracking user interactions in elections
  - Optional: Service can be disabled if `DATA_SHARING_ENDPOINT` not configured

**Outgoing:**
- Events sent to external Data Sharing service via `/api/events` route
- Event data structure: Discriminated union types from `src/types/api.ts`
- Events trigger on user actions: ratings, results sharing, bookmarks

**Data Flow:**
```
Client component → EventsAPI.createEvent()
  → POST /api/events
  → Forward to DATA_SHARING_ENDPOINT/events
  → External service persists event
```

---

*Integration audit: 2026-02-25*
