import { Entities } from "@/types/entity";
import { Ratings } from "@/types/ratings";
import { Result } from "@/types/result";
import { Algorithm } from "@/types/election";

function getMaxOfMatrix(matrix: number[][]): number {
  const flattened = matrix.flat();
  return Math.max(...flattened);
}
function getMinOfMatrix(matrix: number[][]): number {
  const flattened = matrix.flat();
  return Math.min(...flattened);
}

export function calculateResults(
  matrix: number[][],
  entities: Entities,
  userRatings: Ratings,
): Result[] {
  const results: Result[] = [];
  const min = getMinOfMatrix(matrix);
  const max = getMaxOfMatrix(matrix);
  const divider = 100 / (matrix.length - 1);

  // Calculate matches for parties and candidates
  for (const entity of entities) {
    let maxPoints = 0;
    let maxMinusPoints = 0;
    let points = 0.0;
    const entityRatings = entity.ratings || [];

    for (const [thesisId, userRating] of Object.entries(userRatings)) {
      const entityRating = entityRatings[thesisId];
      // If an rating by the entity is not given, skip this thesis in the calculation
      if (
        !entityRating || // TODO remove once validated in the backend
        entityRating.value === "skipped" ||
        entityRating.value === "unrated"
      )
        continue;

      // If an rating by the user is not given, skip this thesis in the calculation
      if (userRating.value === "skipped" || userRating.value === "unrated")
        continue;

      // Get value 2 if favorite is set in oneliner
      const userFavorite = userRating.isFavorite ? 2 : 1;
      const addMaxPoints = userRating.isFavorite ? 2 : 1 * max;
      const addMaxMinusPoints = userRating.isFavorite ? 2 : 1 * min;
      maxPoints += addMaxPoints;
      maxMinusPoints += addMaxMinusPoints;
      const matchIndex = Math.round((entityRating.value || 0) / divider);
      const userIndex = Math.round((userRating.value || 0) / divider);
      const addPoints = matrix[matchIndex][userIndex] * userFavorite;
      points += addPoints;
    }

    maxPoints += Math.abs(maxMinusPoints);
    points += Math.abs(maxMinusPoints);
    let match = Math.round((points / maxPoints) * 1000) / 10;

    // If no ratings have been given yet by the user, set match to 0
    if (maxPoints === 0) {
      match = 0;
    }

    const result: Result = {
      entity,
      matchPercentage: match,
    };

    results.push(result);
  }

  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

/**
 * Converts a rating from a discrete scale value to a normalized 0.0 - 1.0 ratio.
 * For example, if the scale is 5 and the value is 3, it returns 0.5
 * If the scale is 3 and the value is 2, it returns 0.5
 *
 * @param scaleValue - The value on the original scale to be converted (1-based).
 * @param scaleSize - The maximum number of decisions (scale points) defined by the algorithm.
 * @returns A normalized rating between 0.0 and 1.0 (both inclusive).
 */
export function scaleValueToNormalized(
  scaleValue: number,
  scaleSize: Algorithm["decisions"],
): number {
  const clamped = Math.max(1, Math.min(scaleValue, scaleSize));
  return (clamped - 1) / (scaleSize - 1);
}

/**
 * Converts a normalized 0.0 - 1.0 ratio back to a discrete scale value.
 * For example, if the normalized value is 0.5 and the scale is 5, it returns 3
 * If the normalized value is 0.5 and the scale is 3, it returns 2
 *
 * @param normalizedValue - The normalized rating between 0.0 and 1.0 (both inclusive) to be converted.
 * @param scaleSize - The maximum number of decisions (scale points) defined by the algorithm.
 * @returns The corresponding value on the original scale (1-based), rounded to the nearest integer.
 */
export function normalizedToScaleValue(
  normalizedValue: number,
  scaleSize: Algorithm["decisions"],
): number {
  const clamped = Math.max(0, Math.min(normalizedValue, 1));
  return Math.round(clamped * (scaleSize - 1) + 1);
}
