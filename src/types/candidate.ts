import { Ratings } from "./ratings";

export type Candidate = {
  id: number;
  type: "candidate";
  title: string;
  firstName: string;
  lastName: string;
  displayName: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "non-binary" | "unknown";
  image: string; // URL to the candidate's image
  instanceId: number;
  userId: number;
  partyId: number;
  partyName: string; // Name of the party
  description: string;
  district?: string;
  launchDate: string;
  listPlace?: number;
  website?: string;
  status: Status;
  ratings: Ratings;
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
