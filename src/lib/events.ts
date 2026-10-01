import { CreateEventRequest } from "@/types/api";
import { Election } from "@/types/election";
import { Thesis } from "@/types/theses";
import { useUserRatingsStore } from "@/stores/user-ratings-store";

type FinishedEvent = Extract<
  CreateEventRequest,
  { eventType: "voto_finished" }
>;

export function getFinishedEvent(
  electionId: Election["id"],
  skippedToResult: boolean,
): FinishedEvent {
  return {
    electionId,
    eventType: "voto_finished",
    ratings: useUserRatingsStore.getState().userRatings[electionId] ?? {},
    metadata: { skippedToResult },
  };
}

export function skipUnratedTheses(
  electionId: Election["id"],
  thesisIds: Thesis["id"][],
): void {
  const { userRatings, setUserRatingValue } = useUserRatingsStore.getState();
  for (const thesisId of thesisIds) {
    const value = userRatings[electionId]?.[thesisId]?.value;
    if (value === undefined || value === "unrated") {
      setUserRatingValue(electionId, thesisId, "skipped");
    }
  }
}
