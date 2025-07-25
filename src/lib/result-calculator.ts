import { CandidateRatings, Ratings } from "@/types/ratings";

export function calculateResultForCandidate(candidateRatings: CandidateRatings, matrix: number[][], participantRatings: Ratings) {
      const length = matrix.length;
      let maxPoints = 0;
      let maxMinusPoints = 0;
      let points = 0.0;

      Object.entries(candidateRatings.ratings).forEach(([thesisId, candidateRating]) => {
        // "Bugfix" if a vote is missing
        if (!candidateRating) return;
        const min = getMinOfMatrix(matrix);
        const max = getMaxOfMatrix(matrix);
        // Get object key
        const participantRating = participantRatings[thesisId];
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
        if (typeof candidateRating.rating === "undefined") return;
        const matchIndex = Math.round(candidateRating.rating / divider);
        if (typeof participantRating.rating === "undefined") return;
        const userIndex = Math.round(participantRating.rating / divider);
        const addPoints = matrix[matchIndex][userIndex];
        if (participantRating.favorite) {
          points += addPoints * 2; // Double points if favorite
        }
        points += addPoints;
        });

        maxPoints += Math.abs(maxMinusPoints);
        points += Math.abs(maxMinusPoints);
        const match = Math.round((points / maxPoints) * 1000) / 10;
        return match
    }

    export function getMaxOfMatrix(matrix: number[][]) {
      const flattened = matrix.flat();
      return Math.max(...flattened);
    }

    export function getMinOfMatrix(matrix: number[][]) {
      const flattened = matrix.flat();
      return Math.min(...flattened);
    }

