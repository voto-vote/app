import { Ratings } from "./ratings";

export type Party = {
  id: number;
  type: "party";
  parentPartyId?: number;
  electionId: number;
  displayName: string;
  detailedName: string;
  image: string; // URL to the party's image
  description: string;
  website?: string; // URL to the party's website
  status: Status;
  color: string;
  ratings: Ratings;
};

export type Parties = Party[];

export type Status = "created" | "active" | "voted" | "deactivated";
