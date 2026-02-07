import { Entities } from "@/types/entity";
import { Ratings } from "@/types/ratings";
import { Result } from "@/types/result";

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

      // If rating is -1, skip it
      if (userRating.rating === -1) continue;

      // "Bugfix" if a rating is missing
      if (!entityRating) continue;

      // Get value 2 if favorite is set in oneliner
      const userFavorite = userRating.favorite ? 2 : 1;
      const addMaxPoints = userRating.favorite ? 2 : 1 * max;
      const addMaxMinusPoints = userRating.favorite ? 2 : 1 * min;
      maxPoints += addMaxPoints;
      maxMinusPoints += addMaxMinusPoints;
      const matchIndex = Math.round((entityRating.rating || 0) / divider);
      const userIndex = Math.round((userRating.rating || 0) / divider);
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

// Converts a decision key to a percentage based rating on a scale
// For example, if the scale is 5 and the key is 3, it returns 50
// If the scale is 3 and the key is 2, it returns 50
export function convertDecisionToRating(key: number, scale: number): number {
  if (scale <= 1) {
    return 0;
  }

  return Math.max(0, Math.min(100, ((key - 1) / (scale - 1)) * 100));
}

// Converts a rating to a decision key based on the scale
// For example, if the scale is 5 and the rating is 50, it returns 3
export function convertRatingToDecision(rating: number, scale: number): number {
  if (scale <= 1) {
    return 1;
  }

  const key = Math.round((rating / 100) * (scale - 1) + 1);
  return Math.max(1, Math.min(scale, key));
}
