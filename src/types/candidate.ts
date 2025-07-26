export type Candidate = {
  id: number;
  instanceId: number;
  userId: number;
  partyId: number;
  description: string;
  district: string;
  launchDate: string;
  listPlace: number;
  website: string;
  status: Status;
  color: string; // Color from the party
  createdAt: string;
  updatedAt: string;
};

export type Status =
  | "created"
  | "invited"
  | "active"
  | "voted"
  | "deactivated";
