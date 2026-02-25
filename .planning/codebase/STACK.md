# Technology Stack

**Analysis Date:** 2026-02-25

## Languages

**Primary:**
- TypeScript 5.9.2 - Full codebase including React components, Next.js pages, server actions, and utilities
- JavaScript - Configuration files and build scripts

**Secondary:**
- CSS - Tailwind CSS for styling
- JSX/TSX - React component syntax

## Runtime

**Environment:**
- Node.js 24-alpine (Docker target), compatible with Next.js 15.5.2
- Browser runtime for React 19.1.1 client-side code

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (present, 547KB)

## Frameworks

**Core:**
- Next.js 15.5.2 - Full-stack web framework with app router, server actions, API routes
- React 19.1.1 - UI library for components and state management
- React DOM 19.1.1 - DOM rendering for React

**Styling & UI:**
- Tailwind CSS 4.1.12 - Utility-first CSS framework
- Radix UI 1.4.3 - Unstyled, accessible component primitives
- Class Variance Authority 0.7.1 - Component variant management
- Tailwind Merge 3.3.1 - Merging Tailwind classes without conflicts
- Tailwind CSS Animations 1.0.7 - Animation utilities
- Lucide React 0.542.0 - Icon library (13.7.0 additionally via `@icons-pack/react-simple-icons`)

**Internationalization:**
- next-intl 4.3.5 - i18n routing and translation management for Next.js

**Database & ORM:**
- Drizzle ORM 0.44.5 - Type-safe SQL query builder
- pg 8.16.3 - PostgreSQL Node.js client
- Drizzle Kit 0.31.4 (dev) - Schema migration and code generation

**State Management:**
- Zustand 5.0.8 - Lightweight state management with persist middleware

**Markdown Processing:**
- Remark 15.0.1 - Markdown processor
- Remark GFM 4.0.1 - GitHub Flavored Markdown support
- Remark HTML 16.0.1 - Convert markdown to HTML
- Remark Breaks 4.0.0 - Break syntax support

**Animations & Effects:**
- Motion 12.23.12 - Animation library
- Lottie React 2.4.1 - Lottie animation player
- Embla Carousel React 8.6.0 - Carousel component

**Utilities:**
- QRCode 1.5.4 - QR code generation
- Vaul 1.1.2 - UI utility (drawer/modal components)
- clsx 2.1.1 - Conditional className utility

## Testing

**Runner:**
- Vitest 3.2.4 - Fast unit testing framework (config: `vitest.config.mts`)

**Testing Libraries:**
- @testing-library/react 16.3.0 - React component testing utilities
- @testing-library/dom 10.4.1 - DOM testing utilities
- jsdom 26.1.0 - DOM implementation for Node.js

## Build & Development Tools

**Build System:**
- Next.js built-in compiler with Turbopack (via `--turbopack` flag in dev/build)
- TailwindCSS @tailwindcss/postcss 4.1.12 - Tailwind CSS processing

**Linting & Code Quality:**
- ESLint 9.34.0 - JavaScript linting
- ESLint Config Next 15.5.2 - Next.js specific ESLint rules
- Prettier 3.6.2 - Code formatter

**i18n Validation:**
- @lingual/i18n-check 0.8.6 - Translation file validation

**Type Checking:**
- TypeScript 5.9.2 - Static type checking

**PostCSS:**
- PostCSS 8.5.6 - CSS transformation tool

**Development Utilities:**
- @tailwindcss/typography 0.5.16 - Prose styling for content
- @tailwindcss/postcss 4.1.12 - PostCSS plugin for Tailwind
- Vite TSConfig Paths 5.1.4 - Path alias resolution for testing
- @vitejs/plugin-react 5.0.2 - Vitest React support

## Key Dependencies

**Critical:**
- `drizzle-orm` 0.44.5 - Core database abstraction layer for all data operations
- `next` 15.5.2 - Web framework with SSR, server actions, API routes
- `react` 19.1.1 - UI rendering and component foundation
- `zustand` 5.0.8 - State management for client-side features (bookmarks, ratings, etc.)

**Infrastructure:**
- `pg` 8.16.3 - PostgreSQL connection pool and queries
- `next-intl` 4.3.5 - Multi-language support routing and translations

## Configuration

**Environment:**
- Configuration via `.env` file (present, contains secrets - do not read)
- Example: `.env.example` at root with placeholders for `DATABASE_URL`, `OBJECT_STORAGE_URL`, `DATA_SHARING_ENDPOINT`
- Next.js specific: `NEXT_TELEMETRY_DISABLED=1` in Docker build

**Build:**
- `next.config.ts` - Next.js configuration with image remote patterns, i18n plugin, standalone output
- `tsconfig.json` - TypeScript compiler options with path aliases (`@/*` → `./src/*`)
- `postcss.config.mjs` - PostCSS configuration for CSS processing
- `components.json` - UI component configuration
- `drizzle.config.ts` - Drizzle ORM schema and database configuration
- `vitest.config.mts` - Vitest test runner configuration
- `eslint.config.mjs` - ESLint rules

**i18n:**
- Message files in `messages/` directory for translation strings
- `src/i18n/routing.ts` - Locale routing configuration
- `src/i18n/request.ts` - i18n request context setup
- `src/i18n/navigation.ts` - Navigation helpers with locale support

## Platform Requirements

**Development:**
- Node.js 24+ (Alpine Linux compatible)
- npm for package management
- PostgreSQL database connection

**Production:**
- Docker container runtime (Node.js 24-alpine as base)
- PostgreSQL database
- Object storage service (configured via `OBJECT_STORAGE_URL`)
- Data sharing endpoint service (configured via `DATA_SHARING_ENDPOINT`)
- Port 3000 exposed for web traffic

---

*Stack analysis: 2026-02-25*
