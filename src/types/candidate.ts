import { Ratings } from "./ratings";

export type Candidate = {
  id: number;
  type: "candidate";
  title: string;
  firstName: string;
  lastName: string;
  displayName: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  image: string; // URL to the candidate's image
  electionId: number;
  userId: number;
  partyId: number;
  partyName: string; // Name of the party
  description: string;
  district?: string;
  listPlace?: number;
  website?: string; // URL to the candidate's website
  status: Status;
  ratings: Ratings;
  color: string; // Color from the party
};

export type Candidates = Candidate[];

export type Status = "created" | "invited" | "active" | "voted" | "deactivated";
