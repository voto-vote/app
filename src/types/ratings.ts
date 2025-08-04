import { type Thesis } from "@/types/theses";

export type Rating = {
  rating: number | undefined; // undefined means no rating given yet, -1 means skipped, 0 - 100
  favorite: boolean;
  timestamp?: number; // timestamp of when the rating was given
  explanation?: string;
};

export type Ratings = {
  [thesisId: Thesis["id"]]: Rating;
};
