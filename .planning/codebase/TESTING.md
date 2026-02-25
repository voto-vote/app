# Testing Patterns

**Analysis Date:** 2026-02-25

## Test Framework

**Runner:**
- Vitest 3.2.4
- Config: `vitest.config.mts`
- Environment: jsdom (browser DOM simulation for React testing)

**Assertion Library:**
- Vitest built-in assertions (`expect`)
- Testing Library for component testing (React 16.3.0)

**Run Commands:**
```bash
npm run test              # Run all tests once
npm run test -- --watch  # Watch mode (inferred from vitest config)
npm run test -- --coverage  # Coverage report (vitest --coverage)
```

## Test File Organization

**Location:**
- Co-located with source files in same directory
- Test files named with `.test.ts` or `.test.tsx` suffix

**Naming:**
- `[filename].test.ts` for unit tests of TypeScript files
- Examples: `result-calculator.test.ts`, `theses-action.test.ts`

**Structure:**
```
src/
├── lib/
│   ├── result-calculator.ts
│   └── result-calculator.test.ts
├── actions/
│   ├── theses-action.ts
│   └── theses-action.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect } from "vitest";
import { parseThesisText } from "./theses-action";

describe("parseThesisText", () => {
  it("replaces {title} and {location} placeholders", async () => {
    const input = "Election: {title} in {location}";
    const result = await parseThesisText(input, "General Election", "Berlin");
    expect(result.text).toBe("Election: General Election in Berlin");
    expect(result.explanations).toEqual([]);
  });

  it("extracts explanations and replaces text", async () => {
    const input = "This is a (thesis)[explanation].";
    const result = await parseThesisText(input, "Title", "Location");
    expect(result.text).toBe("This is a thesis.");
    expect(result.explanations.length).toBe(1);
  });
});
```

**Patterns:**
- `describe()` block wraps related test cases
- Nested `describe()` blocks for logical grouping (see `convertRatingToDecision` nested in `convertDecision`)
- Each `it()` block tests a single scenario
- Descriptive test names explaining expected behavior

## Assertion Patterns

**Common Assertions:**
- `expect(value).toBe(expected)` for exact equality
- `expect(value).toEqual(expected)` for object/array deep equality
- `expect(array).toHaveLength(number)` for array length checks

**Example from codebase:**
```typescript
it("returns 0 if scale is 1", () => {
  expect(convertDecisionToRating(1, 1)).toBe(0);
  expect(convertDecisionToRating(5, 1)).toBe(0);
});

it("handles multiple explanations", async () => {
  const input = "First (one)[exp1], then (two)[exp2].";
  const result = await parseThesisText(input, "Title", "Location");
  expect(result.text).toBe("First one, then two.");
  expect(result.explanations.length).toBe(2);
  expect(result.explanations[0].text).toBe("exp1");
  expect(result.explanations[0].startOffset).toBe(6);
  expect(result.explanations[0].endOffset).toBe(9);
});
```

## Test Data and Fixtures

**Inline Test Data:**
- Test data defined inline in test cases
- Simple inputs: strings, numbers, arrays
- No separate fixture files detected

**Example pattern:**
```typescript
it("extracts explanations and replaces text", async () => {
  const input = "This is a (thesis)[explanation].";
  const result = await parseThesisText(input, "Title", "Location");
  // assertions
});
```

**Data Objects:**
- Scalar values and simple strings used directly
- Array results validated with `toEqual()` for deep comparison

## Test Scope

**Unit Tests:**
- Pure functions tested in isolation
- `result-calculator.test.ts`: Tests mathematical conversion functions
  - `convertDecisionToRating()` - converts scale position to percentage
  - `convertRatingToDecision()` - converts percentage to scale position
  - Edge cases: scale edge values, out-of-range inputs
- `theses-action.test.ts`: Tests text parsing and placeholder replacement
  - Placeholder substitution ({title}, {location})
  - Explanation extraction from markdown-like syntax
  - Multiple explanation handling
  - Whitespace trimming

**Server Action Testing:**
- Async functions tested with `async/await`
- Example: `parseThesisText()` is async, awaited in tests

## Edge Case Testing

**Comprehensive Coverage:**
- Boundary values tested explicitly
- Edge cases in conversion functions:
  ```typescript
  it("handles scale less than 1", () => {
    expect(convertDecisionToRating(1, 0)).toBe(0);
    expect(convertDecisionToRating(1, -2)).toBe(0);
  });

  it("handles keys outside the scale", () => {
    expect(convertDecisionToRating(6, 5)).toBe(100);
    expect(convertDecisionToRating(0, 5)).toBe(0);
  });
  ```

- Text parsing edge cases:
  ```typescript
  it("trims explanation and thesis text", async () => {
    const input = "A (  thesis  )[  explanation  ]!";
    const result = await parseThesisText(input, "Title", "Location");
    expect(result.text).toBe("A thesis!");
    expect(result.explanations[0].text).toBe("explanation");
  });
  ```

## Mocking

**Framework:**
- Vitest built-in mocking capabilities available (not heavily used in visible tests)
- No explicit mocking in found test files
- Pure functions tested without mocks

**What to Mock:**
- Database calls (likely mocked in integration tests if they exist)
- HTTP requests (EventsAPI or fetch calls)
- External service calls
- Zustand store calls (if testing components that use stores)

**What NOT to Mock:**
- Pure utility functions (test with real input/output)
- Type conversions and calculations
- Text parsing logic
- React hooks (testing React Testing Library components)

## Current Test Coverage

**Tested Modules:**
- `src/lib/result-calculator.ts` - 100% of functions tested
- `src/actions/theses-action.ts` - `parseThesisText()` function tested

**Untested Areas:**
- React components (no `.test.tsx` files found)
- Server actions in `src/actions/` (only `theses-action.ts` has basic tests)
- Database operations
- API calls and integrations
- Zustand stores
- React contexts
- UI interactions and event handling
- Utility functions in `src/lib/` (color-utils, url-utils, entity-utils, etc.)

## Testing Gaps

**High Priority:**
- No React component tests (file: `/src/app/[locale]/.../*.tsx` files untested)
  - Header, navigation, dialogs, carousels need testing
  - Components with complex state (Header, SurveyDialog, FilterDialog)
- No API/integration tests
  - EventsAPI calls need mocking and validation
  - Database queries in server actions lack testing
- No error scenario testing for real API calls

**Medium Priority:**
- Utility functions need unit tests (color-utils, url-utils)
- Zustand stores need state mutation testing
- React context provider behavior needs testing

**Low Priority:**
- E2E tests (no test framework detected; likely handled manually)

## Example Test Patterns to Follow

**Async Function Testing:**
```typescript
describe("parseThesisText", () => {
  it("replaces {title} and {location} placeholders", async () => {
    const input = "Election: {title} in {location}";
    const result = await parseThesisText(input, "General Election", "Berlin");
    expect(result.text).toBe("Election: General Election in Berlin");
  });
});
```

**Calculation Function Testing:**
```typescript
describe("convertDecision", () => {
  it("returns 0 if scale is 1", () => {
    expect(convertDecisionToRating(1, 1)).toBe(0);
  });

  it("returns 100 for the highest key", () => {
    expect(convertDecisionToRating(3, 3)).toBe(100);
  });

  it("returns correct percentage for middle keys", () => {
    expect(convertDecisionToRating(2, 5)).toBe(25);
    expect(convertDecisionToRating(3, 5)).toBe(50);
  });
});
```

## Running Tests

**All Tests:**
```bash
npm run test
```

**Watch Mode (Typical Development):**
```bash
npm run test -- --watch
```

**With Coverage:**
```bash
npm run test -- --coverage
```

**Specific Test File:**
```bash
npm run test -- src/lib/result-calculator.test.ts
```

## Test Configuration Details

**vitest.config.mts:**
```typescript
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
  },
});
```

- Uses jsdom for DOM simulation in Node.js
- Integrates TypeScript path resolution via `tsconfigPaths()`
- React plugin enabled for component testing support

## Adding New Tests

**When creating tests for a new function:**
1. Create `[filename].test.ts` in same directory as implementation
2. Import the function from the adjacent file
3. Use `describe()` block with function name
4. Add multiple `it()` blocks for different scenarios
5. Include edge cases and boundary conditions
6. Use clear, descriptive test names explaining expected behavior

**Example template:**
```typescript
import { describe, it, expect } from "vitest";
import { myNewFunction } from "./my-new-function";

describe("myNewFunction", () => {
  it("handles the happy path", () => {
    const result = myNewFunction("input");
    expect(result).toBe("expected output");
  });

  it("handles edge case", () => {
    const result = myNewFunction("");
    expect(result).toBe("fallback");
  });

  it("handles error condition", () => {
    expect(() => myNewFunction(null)).toThrow();
  });
});
```

---

*Testing analysis: 2026-02-25*
