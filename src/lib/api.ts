import axios from 'axios';
import { 
  CreateEventRequest, 
  ApiResponse
} from '@/types/api';

// Base API configuration
export const apiClient = axios.create({
  baseURL: 'https://api.voto.vote',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

export class EventsAPI {
  /**
   * Create a new event
   */
  static async createEvent(
    eventData: CreateEventRequest
  ): Promise<ApiResponse> {
      const response = await apiClient.post(
        '/events',
        {
          ...eventData,
        }
      );
      return response.data.data
  }
}