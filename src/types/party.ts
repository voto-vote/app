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
  createdAt: string;
  updatedAt: string;
};

export type Status =
  | "created"
  | "active"
  | "voted"
  | "deactivated";
