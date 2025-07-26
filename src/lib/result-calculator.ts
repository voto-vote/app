import { CandidateRatings, PartyRatings, Rating, Ratings } from "@/types/ratings";

export function calculateResultForCandidate(candidateRatings: CandidateRatings, matrix: number[][], participantRatings: Ratings) {
      let maxPoints = 0;
      let maxMinusPoints = 0;
      let points = 0.0;
    Object.entries(candidateRatings.ratings).forEach(([thesisId, candidateRating]) => {
        const ratingResult = calculatePointsForRating(thesisId, candidateRating, participantRatings[thesisId], matrix, maxPoints, maxMinusPoints, points);
        maxPoints = ratingResult?.maxPoints || 0;
        maxMinusPoints = ratingResult?.maxMinusPoints || 0;
        points = ratingResult?.points || 0;
      });
      maxPoints += Math.abs(maxMinusPoints);
      points += Math.abs(maxMinusPoints);
      const match = Math.round((points / maxPoints) * 1000) / 10;
      return match;
    }

    export function calculateResultForParty(partyRatings: PartyRatings, matrix: number[][], participantRatings: Ratings) : number {
      let maxPoints = 0;
      let maxMinusPoints = 0;
      let points = 0.0;
      Object.entries(partyRatings.ratings).forEach(([thesisId, partyRating]) => {
        const ratingResult = calculatePointsForRating(thesisId, partyRating, participantRatings[thesisId], matrix, maxPoints, maxMinusPoints, points);
        maxPoints = ratingResult?.maxPoints || 0;
        maxMinusPoints = ratingResult?.maxMinusPoints || 0;
        points = ratingResult?.points || 0;
      });
      maxPoints += Math.abs(maxMinusPoints);
      points += Math.abs(maxMinusPoints);
      const match = Math.round((points / maxPoints) * 1000) / 10;
      return match;
    }

    function calculatePointsForRating(thesisId: string, matchRating: Rating, participantRating: Rating, matrix: number[][], maxPoints: number, maxMinusPoints: number, points: number) : RatingCalculationResult | undefined {
        if (!matchRating) return;
        const min = getMinOfMatrix(matrix);
        const max = getMaxOfMatrix(matrix);
        // Get object key
        if (!participantRating) return;
        // If participantratings is favorite, duplicate max points
        let addMaxPoints = max;
        if (participantRating.favorite) {
            addMaxPoints *= 2;
        }
        let addMaxMinusPoints = min;
        if (participantRating.favorite) {
            addMaxMinusPoints *= 2;
        }
        maxPoints += addMaxPoints;
        maxMinusPoints += addMaxMinusPoints;
        const divider = 100 / (length - 1);
         if (typeof matchRating.rating === "undefined") return;
        const matchIndex = Math.round(matchRating.rating / divider);
        if (typeof participantRating.rating === "undefined") return;
        const userIndex = Math.round(participantRating.rating / divider);
        const addPoints = matrix[matchIndex][userIndex];
        if (participantRating.favorite) {
          points += addPoints * 2; // Double points if favorite
        }
        points += addPoints;
        return { maxPoints, maxMinusPoints, points };
    }

    export type RatingCalculationResult = {
      maxPoints: number;
      maxMinusPoints: number;
      points: number;
    };

    export function getMaxOfMatrix(matrix: number[][]) {
      const flattened = matrix.flat();
      return Math.max(...flattened);
    }

    export function getMinOfMatrix(matrix: number[][]) {
      const flattened = matrix.flat();
      return Math.min(...flattened);
    }

