import { Election } from "./election";
import { Ratings } from "./ratings";

// Event types
export interface CreateEventRequest {
  electionId: Election["id"];
  eventType: "voto_started" | "voto_finished";
  ratings?: Ratings;
}
