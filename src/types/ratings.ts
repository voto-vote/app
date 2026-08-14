import { type Thesis } from "@/types/theses";

/**
 * 0-1 normalized rating value, or special values "unrated" or "skipped"
 */
export type RatingValue = number | "unrated" | "skipped";

export type Rating = {
  value: RatingValue;
  isFavorite: boolean;
  ratedAt?: number;
  explanation?: string;
};

export type Ratings = {
  [thesisId: Thesis["id"]]: Rating;
};
