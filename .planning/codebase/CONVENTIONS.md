# Coding Conventions

**Analysis Date:** 2026-02-25

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `Header.tsx`, `SurveyDialog.tsx`)
- Server actions: kebab-case with `-action` suffix (e.g., `election-action.ts`, `theses-action.ts`)
- Utility modules: kebab-case (e.g., `color-utils.ts`, `result-calculator.ts`, `url-utils.ts`)
- Type definitions: kebab-case (e.g., `entity.ts`, `ratings.ts`, `api.ts`)
- Stores: kebab-case with `-store` suffix (e.g., `theses-store.ts`, `back-button-store.ts`)
- Hooks: kebab-case with `use-` prefix (e.g., `use-breakpoint.ts`)
- Context files: kebab-case with `-context` suffix (e.g., `header-context.tsx`, `election-context.tsx`)

**Functions:**
- Regular functions: camelCase (e.g., `calculateResults`, `getElection`, `parseThesisText`)
- React components: PascalCase (e.g., `Header`, `Intro`, `SurveyDialog`)
- Server-side async functions: camelCase with `async` keyword (e.g., `async function getTheses()`)
- Utility functions: camelCase (e.g., `hexToRgb`, `parseColor`, `getLuminance`)
- Private/internal helper functions: camelCase with leading underscore not used; instead kept lowercase and private to module scope

**Variables:**
- State variables (React hooks): camelCase (e.g., `currentPage`, `surveyUrl`, `isSurveyDialogOpen`)
- Boolean variables: prefix with `is` or similar (e.g., `isDesktop`, `isSurveySeen`, `isSurveyDialogOpen`)
- Constants: camelCase for module-level, SCREAMING_SNAKE_CASE for config values (e.g., `SURVEY_TIMEOUT = 5000`)
- Destructured imports: camelCase or PascalCase depending on type
- Object/array results: camelCase (e.g., `availableLanguages`, `numberOfTheses`, `entityRatings`)

**Types:**
- Type definitions: PascalCase and singular (e.g., `Candidate`, `Party`, `Election`, `Result`)
- Union types: PascalCase concatenated (e.g., `VotoStartedEvent`, `VotoFinishedEvent`)
- Array types: Plural PascalCase (e.g., `Candidates`, `Parties`, `Entities`, `Theses`)
- Status/enum-like types: lowercase string literals (e.g., `"created" | "active" | "voted"`)
- Record/dictionary types: camelCase (e.g., `userRatings`, `entityRatings`)
- Interfaces: PascalCase with `Props` suffix for component props (e.g., `SurveyDialogProps`)
- Generic state types: `State` and `Action` for Zustand store definitions

## Code Style

**Formatting:**
- Prettier is NOT configured (no `.prettierrc` file)
- Default ESLint formatting rules apply
- Indentation: 2 spaces (inferred from codebase)
- Semicolons: Present in most code
- Quotes: Double quotes for strings in TypeScript/React code
- Line length: No strict enforcement visible, but files maintain readable widths

**Linting:**
- ESLint: Version 9.34.0 with Next.js configuration
- Config file: `eslint.config.mjs` (flat config format)
- Extends: `next/core-web-vitals` and `next/typescript`
- Ignored paths: `node_modules/**`, `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

## Import Organization

**Order:**
1. External libraries (React, Next.js, third-party packages)
2. Internal utilities and hooks from `@/` alias
3. Relative imports (rarely used due to path aliases)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- All imports use the `@/` alias for internal imports
- Examples: `@/lib/`, `@/types/`, `@/components/`, `@/db/`, `@/actions/`, `@/stores/`, `@/contexts/`, `@/hooks/`

**Import Patterns:**
```typescript
// External libraries first
import { describe, it, expect } from "vitest";
import { create } from "zustand";
import { eq, and } from "drizzle-orm";

// Next.js and React
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

// Internal utilities and types
import { cn } from "@/lib/utils";
import { isLightColor } from "@/lib/color-utils";
import { Election } from "@/types/election";
import { useThesesStore } from "@/stores/theses-store";
import { HeaderProvider } from "@/contexts/header-context";

// Server action marker
"use server";
```

## Error Handling

**Patterns:**
- Try-catch blocks used for explicit error handling in functions that may fail
- Environment variable validation with `throw new Error()` for missing critical config
- Graceful fallbacks returning `null` for recoverable errors (e.g., `election not found` returns `null`)
- Console logging with `console.error()` in catch blocks for debugging
- API errors handled with try-catch and silent fallback (e.g., EventsAPI returns empty string on error)
- Missing data handled with conditional checks rather than exceptions

**Example patterns:**
```typescript
// Environment variable validation
const objectStorageUrl = process.env.OBJECT_STORAGE_URL;
if (!objectStorageUrl) {
  throw new Error("OBJECT_STORAGE_URL is not defined in the environment variables.");
}

// Try-catch with graceful fallback
try {
  const result = await Promise.all([...operations]);
} catch {
  return null; // Election not found
}

// URL parsing with error handling
try {
  return new URL(url).toString();
} catch (e) {
  console.error(`Invalid URL: ${url}`, e);
  return undefined;
}

// API calls with error logging
try {
  const response = await fetch("/api/events", {...});
  return await response.text();
} catch (error) {
  console.error("Error creating event:", error);
  return "";
}
```

## Logging

**Framework:** `console` object (native browser/Node.js logging)

**Patterns:**
- `console.error()` used for exception logging and error context
- Minimal logging in production code; errors logged at point of failure
- Error messages include context (e.g., `Invalid URL: ${url}`)
- No structured logging framework (Pino, Winston, etc.) detected

**Example:**
```typescript
console.error(`Invalid URL: ${url}`, e);
console.error("Error creating event:", error);
```

## Comments

**When to Comment:**
- Inline comments explain non-obvious logic or workarounds
- "Bugfix" comments used to flag temporary solutions
- Comments on complex formulas explain calculation intent
- Setup/teardown comments in UI hooks explain lifecycle

**JSDoc/TSDoc:**
- Functions documented with JSDoc blocks for public APIs
- Parameter and return types documented with `@param` and implied return
- Complex calculations explained with multi-line comments
- No formal JSDoc tags used beyond basic function descriptions

**Example patterns:**
```typescript
/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Implementation
}

/**
 * Determine if a color is light or dark
 * Returns true if the color is light (should use dark text)
 * @param color - The color in hex or rgb format
 */
export function isLightColor(color: string): boolean {
  // Implementation
}

// Inline comment explaining non-obvious behavior
// "Bugfix" if a rating is missing
if (!entityRating) continue;

// Comment explaining formula
// Converts a decision key to a percentage based rating on a scale
// For example, if the scale is 5 and the key is 3, it returns 50
export function convertDecisionToRating(key: number, scale: number): number {
  // Implementation
}
```

## Function Design

**Size:**
- Utility functions typically 5-20 lines
- Component rendering functions range 50-400+ lines (due to JSX)
- Server actions 30-80 lines
- No strict length limit enforced; readability is key

**Parameters:**
- Destructured when multiple related parameters (e.g., component props)
- Explicit typed parameters (TypeScript strict mode enabled)
- Async functions use `async/await` pattern
- Optional parameters documented in JSDoc

**Return Values:**
- Typed return values enforced by TypeScript
- Null return for "not found" scenarios
- Promise return for async operations
- Union types for flexible returns (e.g., success object or null)

**Example structure:**
```typescript
export async function getElection(id: string): Promise<Election | null> {
  // Validation
  const objectStorageUrl = process.env.OBJECT_STORAGE_URL;
  if (!objectStorageUrl) {
    throw new Error("OBJECT_STORAGE_URL is not defined...");
  }

  // Build queries
  const availableLanguagesData = db.selectDistinct(...);

  // Execute with error handling
  try {
    const [data1, data2] = await Promise.all([query1, query2]);
  } catch {
    return null;
  }

  // Transform and return
  const result: Election = { ...data };
  return result;
}
```

## Module Design

**Exports:**
- Named exports preferred for functions and types
- Default exports for React components (e.g., `export default function Header()`)
- Barrel exports not used; each file exports its own definitions
- Re-export pattern: `export { Button, buttonVariants }` for related exports

**Module structure - Types:**
- All types exported at module level
- Union types defined inline (e.g., `VotoStartedEvent | VotoFinishedEvent`)
- Type re-composition common (e.g., `type Entities = Entity[]`)

**Module structure - Utilities:**
- Pure functions exported as named exports
- Helper functions private to module (no underscore prefix needed; just no export statement)
- Exported and internal functions in same file

**Module structure - React:**
- Default export for main component
- Component-local types at top of file (e.g., `type IntroEntry`)
- Component-local constants above component definition (e.g., `const SURVEY_TIMEOUT = 5000`)

**Example patterns:**
```typescript
// Types file - all exports at module level
export type Candidate = { /* ... */ };
export type Candidates = Candidate[];
export type Status = "created" | "invited" | "active" | "voted" | "deactivated";

// Utility file - named exports for functions
export function isLightColor(color: string): boolean { /* ... */ }
export function isVeryLightColor(color: string): boolean { /* ... */ }

// Helper (not exported, private to module)
function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Implementation
}

// Component - default export
export default function Header() {
  // Component code
}

// Component with related variant exports
export { Button, buttonVariants }
```

## State Management

**Zustand Stores:**
- Typed with `State` and `Action` generic types
- Stores created with `create<State & Action>()` pattern
- Used for client-side persistent state (e.g., `useThesesStore`, `useBackButtonStore`)
- Actions defined as part of store creation
- Store hooks follow `use[Name]Store` naming

**React Context:**
- Used for shared UI state (e.g., `HeaderContext`, `ElectionContext`)
- Context providers wrap component trees
- Custom hooks provided alongside context (e.g., `useHeader()`, `useElection()`)

**Component State:**
- `useState` for local component state
- `useEffect` for side effects and initialization
- State variables prefixed with `is` for booleans

## Async Patterns

**Async Operations:**
- `async/await` syntax used exclusively (no `.then()` chains)
- `await Promise.all()` for concurrent operations
- Try-catch for error handling
- Server actions marked with `"use server"` at top of file

**Example:**
```typescript
export async function getElection(id: string): Promise<Election | null> {
  try {
    const [availableLanguages, numberOfTheses, instance, configuration] =
      await Promise.all([
        availableLanguagesData,
        numberOfThesesData,
        instanceData,
        configurationPromise,
      ]);
  } catch {
    return null;
  }
}
```

## UI Component Patterns

**Component Props:**
- Typed as interface with `Props` suffix (e.g., `SurveyDialogProps`)
- Destructured in function parameters
- Optional props use `?` in type definition
- Spread operator used for passing through HTML attributes

**Styling:**
- Tailwind CSS classes used throughout
- Class composition with `cn()` utility from `clsx` and `tailwind-merge`
- Variant classes via `class-variance-authority` (CVA)
- No CSS-in-JS except Tailwind

**Component structure:**
```typescript
interface SurveyDialogProps {
  type: keyof Survey;
}

export default function SurveyDialog({ type }: SurveyDialogProps) {
  const [isSurveyDialogOpen, setSurveyDialogOpen] = useState(false);

  useEffect(() => {
    // Initialization
  }, [dependencies]);

  return (
    <div className="container mx-auto flex flex-col">
      {/* JSX */}
    </div>
  );
}
```

---

*Convention analysis: 2026-02-25*
