import { type Thesis } from "./thesis";

export type Rating = {
  rating: number | null; // null means no rating given
  favorite: boolean;
};

export type Ratings = {
  [thesisId: Thesis["id"]]: Rating;
};
