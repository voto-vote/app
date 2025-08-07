import { CreateEventRequest } from "@/types/api";

export class EventsAPI {
  /**
   * Create a new event
   */
  static async createEvent(eventData: CreateEventRequest): Promise<string> {
    try {
      const response = await fetch("/api/events", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(eventData),
      });
      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Error creating event:", error);
      return "";
    }
  }
}
