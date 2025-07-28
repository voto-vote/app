import { Candidate, Candidates } from "@/types/candidate";
import { Parties, Party } from "@/types/party";
import { Ratings } from "@/types/ratings";
import { Results, Result } from "@/types/result";

export function calculateResults(
  ratings: Ratings,
  matrix: number[][],
  parties?: Parties,
  candidates?: Candidates
): Results {
  const results: Results = {
    partyResults: calculateResult(matrix, parties || [], ratings),
    candidateResults: calculateResult(matrix, candidates || [], ratings),
  };

  return results;
}

function getMaxOfMatrix(matrix: number[][]): number {
  const flattened = matrix.flat();
  return Math.max(...flattened);
}
function getMinOfMatrix(matrix: number[][]): number {
  const flattened = matrix.flat();
  return Math.min(...flattened);
}

const threeDecisionsMap: Record<number, number> = {
  1: 0,
  2: 50,
  3: 100,
};
const fiveDecisionsMap: Record<number, number> = {
  1: 0,
  2: 25,
  3: 50,
  4: 75,
  5: 100,
};

function calculateResult<T extends Party | Candidate>(
  matrix: number[][],
  entities: T[],
  ratings: Ratings
): Result<T>[] {
  const results: Result<T>[] = [];
  const ratingMap = matrix.length === 3 ? threeDecisionsMap : fiveDecisionsMap;
  const min = getMinOfMatrix(matrix);
  const max = getMaxOfMatrix(matrix);
  const divider = 100 / (matrix.length - 1);

  // Calculate matches for parties and candidates
  for (const entity of entities) {
    let maxPoints = 0;
    let maxMinusPoints = 0;
    let points = 0.0;
    const entityRatings = entity.ratings || [];

    for (const [thesisId, rating] of Object.entries(ratings)) {
      const entityRating = entityRatings[thesisId];
      // "Bugfix" if a rating is missing
      if (!entityRating) continue;

      // Get value 2 if favorite is set in oneliner
      const userFavorite = rating.favorite ? 2 : 1;
      const addMaxPoints = rating.favorite ? 2 : 1 * max;
      const addMaxMinusPoints = rating.favorite ? 2 : 1 * min;
      maxPoints += addMaxPoints;
      maxMinusPoints += addMaxMinusPoints;
      const matchIndex = Math.round((entityRating.rating || 0) / divider);
      const userIndex = Math.round(
        (ratingMap[rating.rating || 0] || 0) / divider
      );
      const addPoints = matrix[matchIndex][userIndex] * userFavorite;
      points += addPoints;
    }

    maxPoints += Math.abs(maxMinusPoints);
    points += Math.abs(maxMinusPoints);
    const match = Math.round((points / maxPoints) * 1000) / 10;

    results.push({
      entity,
      matchPercentage: match,
    });
  }

  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
