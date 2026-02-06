// Mock utility functions

/**
 * Simulates network delay for realistic UX
 */
export async function simulateDelay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

/**
 * Generates a unique numeric ID
 */
export function generateNumericId(): number {
  return Math.floor(Math.random() * 10000000) + Date.now();
}

/**
 * Returns a random element from an array
 */
export function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns current ISO timestamp
 */
export function now(): string {
  return new Date().toISOString();
}

/**
 * Returns a date N days from now
 */
export function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

/**
 * Returns a date N days ago
 */
export function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}
