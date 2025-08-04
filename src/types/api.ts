// types/api.ts

import { Ratings } from "./ratings";
// Event types
export interface CreateEventRequest {
  electionId: number;
  eventType: string;
  ratings: undefined | Ratings
}
