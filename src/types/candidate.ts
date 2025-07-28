import { MatchRating } from "./ratings";

export type Candidate = {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  instanceId: number;
  userId: number;
  partyId: number;
  description: string;
  district: string;
  launchDate: string;
  listPlace: number;
  website: string;
  status: Status;
  ratings: MatchRating[];
  color: string; // Color from the party
  createdAt: string;
  updatedAt: string;
};

export type Candidates = Candidate[];

export type Status = "created" | "invited" | "active" | "voted" | "deactivated";

export type CandidateVote = {
  id: number;
  instanceId: number;
  statementId: number;
  candidateId: number;
  value: number; // Rating value
  explanation?: string; // Optional explanation for the rating
};
