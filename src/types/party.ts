import { MatchRating } from "./ratings";

export type Party = {
  id: number;
  parentPartyId: number;
  instanceId: number;
  shortName: string;
  detailedName: string;
  description: string;
  website: string;
  status: Status;
  color: string;
  ratings: MatchRating[];
  createdAt: string;
  updatedAt: string;
};

export type Parties = Party[];

export type Status = "created" | "active" | "voted" | "deactivated";
