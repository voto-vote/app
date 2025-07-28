"use server";


/*
  const participantRatings: Ratings = useRatingsStore.getState().ratings.get(
    parseInt(instanceId)
  ) || {};
  console.log("Participant Ratings: ", participantRatings);
  const matrix: number[][] = [
    [1, 0, -1],
    [0, 0.5, 0],
    [-1, 0, 1]
  ]

  const partyRatingsMap = new Map<Party["id"], PartyRatings>();
  partyVotesResult.forEach((vote) => {
    if (!partyRatingsMap.has(vote.partyId)) {
      partyRatingsMap.set(vote.partyId, {
        partyId: vote.partyId,
        ratings: {}
      });
    }
    const partyRating = partyRatingsMap.get(vote.partyId)!;
    partyRating.ratings[vote.statementId] = {
      rating: vote.value,
      favorite: false 
    };
  });

  const candidateRatingsMap = new Map<Candidate["id"], CandidateRatings>();
  candidateVotesResult.forEach((vote) => {
    if (!candidateRatingsMap.has(vote.candidateId)) {
      candidateRatingsMap.set(vote.candidateId, {
        candidateId: vote.candidateId,
        ratings: {}
      });
    }
    const candidateRating = candidateRatingsMap.get(vote.candidateId)!;
    candidateRating.ratings[vote.statementId] = {
      rating: vote.value,
      favorite: false 
    };
  });

  // Call calculateResultForCandidate for each candidate
  candidateRatingsMap.forEach((candidateRating: CandidateRatings) => {
    const result = calculateResultForCandidate(
      candidateRating, 
      matrix, 
      participantRatings
    );
    // Do something with the result
    console.log(`Result for candidate ${candidateRating.candidateId}:`, result);
  });

  // Or if you want to collect all results:
  const candidateResults = Array.from(candidateRatingsMap.values()).map((candidateRating) => {
    return {
      candidateId: candidateRating.candidateId,
      result: calculateResultForCandidate(candidateRating, matrix, participantRatings)
    };
  });
  console.log("CandidateResults: "+candidateResults)
  // TODO: Return real type.
  return {}
}
    

*/