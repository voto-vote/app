import { type Thesis } from "./thesis";

export type Rating = {
  rating: number | undefined; // undefined means no rating given yet, -1 means skipped
  favorite: boolean;
};

export type Ratings = {
  [thesisId: Thesis["id"]]: Rating;
};
