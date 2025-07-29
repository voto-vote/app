import { Ratings } from "./ratings";

export type Party = {
  id: number;
  type: "party";
  parentPartyId: number;
  instanceId: number;
  displayName: string;
  detailedName: string;
  image: string; // URL to the party's image
  description: string;
  website?: string;
  status: Status;
  color: string;
  ratings: Ratings;
  createdAt: string;
  updatedAt: string;
};

export type Parties = Party[];

export type Status = "created" | "active" | "voted" | "deactivated";
