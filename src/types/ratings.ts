import { type Thesis } from "@/types/theses";
import { Candidate } from "./candidate";
import { Party } from "./party";

export type Rating = {
  rating: number | undefined; 
  favorite: boolean;
};

export type MatchRating = {
  thesisId: Thesis["id"];
  rating: number | undefined;
  explanation?: string; // Optional explanation for the rating
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
