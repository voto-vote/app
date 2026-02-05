import { Election } from "./election";
import { Ratings } from "./ratings";

// Event types
interface BaseEventRequest {
  electionId: Election["id"];
}

interface VotoStartedEvent extends BaseEventRequest {
  eventType: "voto_started";
}

interface VotoFinishedEvent extends BaseEventRequest {
  eventType: "voto_finished";
  ratings?: Ratings;
  metadata: {
    shortcut: boolean;
  };
}

export type CreateEventRequest = VotoStartedEvent | VotoFinishedEvent;
