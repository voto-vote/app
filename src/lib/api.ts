import { CreateEventRequest } from "@/types/api";
import { Ratings } from "@/types/ratings";

function toBackendRatings(ratings: Ratings) {
  return Object.fromEntries(
    Object.entries(ratings).map(([thesisId, rating]) => [
      thesisId,
      {
        rating:
          rating.value === "unrated"
            ? null
            : rating.value === "skipped"
              ? -1
              : Math.round(rating.value * 100),
        favorite: rating.isFavorite,
      },
    ]),
  );
}

export class EventsAPI {
  /**
   * Create a new event
   */
  static async createEvent(eventData: CreateEventRequest): Promise<string> {
    try {
      const response = await fetch("/api/events", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(
          eventData.eventType === "voto_finished"
            ? { ...eventData, ratings: toBackendRatings(eventData.ratings) }
            : eventData,
        ),
      });
      if (!response.ok) {
        throw new Error(`Event request failed with status ${response.status}`);
      }
      if (eventData.eventType === "voto_started") {
        return "";
      }
      const data: unknown = await response.json();
      if (typeof data !== "string") {
        throw new Error("Event response did not contain a vote ID");
      }
      return data;
    } catch (error) {
      console.error("Error creating event:", error);
      return "";
    }
  }
}
