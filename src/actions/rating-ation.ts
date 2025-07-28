import { Candidate } from "@/types/candidate";
import { Party } from "@/types/party";
import { MatchRating } from "@/types/ratings";
import { Result } from "@/types/result";

// Types for the algorithm
type VoteItem = {
  userVote: number;
  userWeight: number;
  matchVote: number; // The vote from party or candidate
};

type VoteMap = Map<string, VoteItem>; // thesisId -> VoteItem

function getMinMaxOfMatrix(matrix: number[][]): { min: number; max: number } {
  let max = matrix[0][0];
  let min = matrix[0][0];

  for (const row of matrix) {
    for (const value of row) {
      if (max < value) {
        max = value;
      }
      if (min > value) {
        min = value;
      }
    }
  }

  return { min, max };
}

function calculatePoints(
  voteMap: VoteMap,
  matrix: number[][],
  maxValue: number
): number {
  let maxPoints = 0;
  let maxMinusPoints = 0;
  let points = 0.0;

  for (const [_, voteItem] of voteMap) {
    const { min, max } = getMinMaxOfMatrix(matrix);
    const addMaxPoints = voteItem.userWeight * max;
    const addMaxMinusPoints = voteItem.userWeight * min;
    maxPoints += addMaxPoints;
    maxMinusPoints += addMaxMinusPoints;

    const divider = maxValue / (matrix.length - 1);
    const matchIndex = Math.round(voteItem.matchVote / divider);
    const userIndex = Math.round(voteItem.userVote / divider);
    const addPoints = matrix[matchIndex][userIndex] * voteItem.userWeight;
    points += addPoints;
  }

  maxPoints += Math.abs(maxMinusPoints);
  points += Math.abs(maxMinusPoints);

  const matchPercentage = (points / maxPoints) * 100;
  return matchPercentage;
}

function createVoteMap(
  userRatings: MatchRating[],
  entityRatings: MatchRating[]
): VoteMap {
  const voteMap = new Map<string, VoteItem>();

  // Create a map of user ratings for quick lookup
  const userRatingMap = new Map<string, MatchRating>();
  userRatings.forEach((rating) => {
    userRatingMap.set(rating.thesisId, rating);
  });

  // Create vote items for each thesis where both user and entity have ratings
  entityRatings.forEach((entityRating) => {
    const userRating = userRatingMap.get(entityRating.thesisId);

    if (
      userRating &&
      userRating.rating !== undefined &&
      entityRating.rating !== undefined
    ) {
      voteMap.set(entityRating.thesisId, {
        userVote: userRating.rating,
        userWeight: 1, // You can adjust this based on your weighting logic
        matchVote: entityRating.rating,
      });
    }
  });

  return voteMap;
}

export function calculatePartyMatches(
  userRatings: MatchRating[],
  parties: Party[],
  matrix: number[][]
): Result[] {
  const results: Result[] = [];
  const maxValue = 100;
  // Calculate matches for parties
  if (parties) {
    parties.forEach((party) => {
      const voteMap = createVoteMap(userRatings, party.ratings);
      if (voteMap.size > 0) {
        const matchPercentage = calculatePoints(voteMap, matrix, maxValue);
        results.push({
          entity_id: party.id,
          resultType: "party",
          value: party.id,
          matchPercentage,
          color: party.color,
          displayName: party.shortName,
        });
      }
    });
  }
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export function calculateCandidateMatches(
  userRatings: MatchRating[],
  candidates: Candidate[],
  matrix: number[][]
): Result[] {
  const results: Result[] = [];
  const maxValue = 100;

  if (candidates) {
    candidates.forEach((candidate) => {
      const voteMap = createVoteMap(userRatings, candidate.ratings);
      if (voteMap.size > 0) {
        const matchPercentage = calculatePoints(voteMap, matrix, maxValue);
        results.push({
          entity_id: candidate.id,
          resultType: "candidate",
          value: candidate.id,
          matchPercentage,
          color: candidate.color,
          displayName: `${candidate.title} ${candidate.firstName} ${candidate.lastName}`, // You might want to use a name field if available
        });
      }
    });
  }
  // Sort by match percentage in descending order
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
