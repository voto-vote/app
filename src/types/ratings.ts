import { type Thesis } from "@/types/theses";
import { Candidate } from "./candidate";
import { Party } from "./party";

export type Rating = {
  rating: number | undefined; // undefined means no rating given yet, -1 means skipped
  favorite: boolean;
};

export type Ratings = {
  [thesisId: Thesis["id"]]: Rating;
};

export type CandidateRatings = {
  candidateId: Candidate["id"];
  ratings: Ratings;
};

export type PartyRatings = {
  partyId: Party["id"];
  ratings: Ratings;
};
