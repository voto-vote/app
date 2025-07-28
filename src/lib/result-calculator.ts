import { Candidate } from "@/types/candidate";
import { Party } from "@/types/party";
import { UserRating } from "@/types/ratings";
import { Result } from "@/types/result";

function getMaxOfMatrix(matrix: number[][]): number {
  const flattened = matrix.flat();
  return Math.max(...flattened);
}
function getMinOfMatrix(matrix: number[][]): number {
  const flattened = matrix.flat();
  return Math.min(...flattened);
}

export function calculatePartyMatches(
  userRatings: UserRating[],
  parties: Party[],
  matrix: number[][]
): Result[] {
  const results: Result[] = [];
  // Calculate matches for parties
  if (parties) {
    parties.forEach((party) => {
      const length = matrix.length;
      let maxPoints = 0;
      let maxMinusPoints = 0;
      let points = 0.0;
      const partyVotes = party.ratings || [];
      userRatings.forEach((userVote) => {
        const ratingMap: Record<number, number> = {
          1: 0,
          2: 25,
          3: 50,
          4: 75,
          5: 100,
        };
        if (matrix.length === 3) {
          console.warn("Using 3-point scale for ratings");
          ratingMap[1] = 0;
          ratingMap[2] = 50;
          ratingMap[3] = 100;
        }
        const partyVote = partyVotes.find(
          (vote) => vote.thesisId === userVote.thesisId
        );
        // "Bugfix" if a vote is missing
        if (!partyVote) return;
        const min = getMinOfMatrix(matrix);
        const max = getMaxOfMatrix(matrix);
        // Get value 2 if favorite is set in oneliner
        const userFavorite = userVote.favorite ? 2 : 1;
        const addMaxPoints = userVote.favorite ? 2 : 1 * max;
        const addMaxMinusPoints = userVote.favorite ? 2 : 1 * min;
        maxPoints += addMaxPoints;
        maxMinusPoints += addMaxMinusPoints;
        const divider = 100 / (length - 1);
        const matchIndex = Math.round((partyVote.rating || 0) / divider);
        const userIndex = Math.round(
          (ratingMap[userVote.rating || 0] || 0) / divider
        );
        const addPoints = matrix[matchIndex][userIndex] * userFavorite;
        points += addPoints;
      });
      maxPoints += Math.abs(maxMinusPoints);
      points += Math.abs(maxMinusPoints);
      const match = Math.round((points / maxPoints) * 1000) / 10;

      results.push({
        entity_id: party.id,
        resultType: "party",
        matchPercentage: match,
        color: party.color,
        displayName: `${party.shortName}`,
      });
    });
  }
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export function calculateCandidateMatches(
  userRatings: UserRating[],
  candidates: Candidate[],
  matrix: number[][]
): Result[] {
  const results: Result[] = [];
  // Calculate matches for candidates
  if (candidates) {
    candidates.forEach((candidate) => {
      const length = matrix.length;
      let maxPoints = 0;
      let maxMinusPoints = 0;
      let points = 0.0;
      const candidateVotes = candidate.ratings || [];
      userRatings.forEach((userVote) => {
        const ratingMap: Record<number, number> = {
          1: 0,
          2: 25,
          3: 50,
          4: 75,
          5: 100,
        };
        if (matrix.length === 3) {
          console.warn("Using 3-point scale for ratings");
          ratingMap[1] = 0;
          ratingMap[2] = 50;
          ratingMap[3] = 100;
        }
        const candidateVote = candidateVotes.find(
          (vote) => vote.thesisId === userVote.thesisId
        );
        // "Bugfix" if a vote is missing
        if (!candidateVote) return;
        const min = getMinOfMatrix(matrix);
        const max = getMaxOfMatrix(matrix);
        // Get value 2 if favorite is set in oneliner
        const userFavorite = userVote.favorite ? 2 : 1;
        const addMaxPoints = userVote.favorite ? 2 : 1 * max;
        const addMaxMinusPoints = userVote.favorite ? 2 : 1 * min;
        maxPoints += addMaxPoints;
        maxMinusPoints += addMaxMinusPoints;
        const divider = 100 / (length - 1);
        const matchIndex = Math.round((candidateVote.rating || 0) / divider);
        const userIndex = Math.round(
          (ratingMap[userVote.rating || 0] || 0) / divider
        );
        const addPoints = matrix[matchIndex][userIndex] * userFavorite;
        points += addPoints;
      });
      maxPoints += Math.abs(maxMinusPoints);
      points += Math.abs(maxMinusPoints);
      const match = Math.round((points / maxPoints) * 1000) / 10;

      // Conditionally add title to displayName
      const displayName = candidate.title
        ? `${candidate.title} ${candidate.firstName} ${candidate.lastName}`
        : `${candidate.firstName} ${candidate.lastName}`;

      results.push({
        entity_id: candidate.id,
        resultType: "candidate",
        matchPercentage: match,
        color: candidate.color,
        displayName: displayName,
      });
    });
  }
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
