import { CreateEventRequest } from "@/types/api";

const dataSharingEndpoint = process.env.DATA_SHARING_ENDPOINT;

export class EventsAPI {
  /**
   * Create a new event
   */
  static async createEvent(eventData: CreateEventRequest): Promise<string> {
    if (!dataSharingEndpoint) {
      return "";
    }

    const response = await fetch(dataSharingEndpoint + "/events", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(eventData),
    });
    const data = await response.text();
    return data;
  }
}
