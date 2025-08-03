// types/api.ts

import { Ratings } from "./ratings";

// Base API response structure
export interface ApiResponse {
  message?: string;
  statusCode?: number;
  success: boolean;
}

// Event types
export interface CreateEventRequest {
  electionId: number;
  eventType: string;
  data: undefined | Ratings
}
