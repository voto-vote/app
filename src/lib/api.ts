import axios from 'axios';
import { 
  CreateEventRequest, 
} from '@/types/api';

// Base API configuration
export const apiClient = axios.create({
  baseURL: 'https://api.voto.team',
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
  ): Promise<string> {
      const response = await apiClient.post(
        '/events',
        {
          ...eventData,
        }
      );
      return response.data
  }
}