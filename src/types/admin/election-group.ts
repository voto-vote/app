import type { ElectionStage } from "./election-admin";

export type ElectionGroup = {
  id: number;
  name: string;
  electionDate: string;
  elections: GroupElectionSummary[];
  createdAt: string;
  updatedAt: string;
  createdBy: number;
};

export type GroupElectionSummary = {
  id: number;
  name: string;
  location: string;
  stage: ElectionStage;
  electionDate: string;
};

export type CreateGroupRequest = {
  name: string;
  electionDate: string;
  electionIds?: number[];
};

export type UpdateGroupRequest = Partial<CreateGroupRequest>;

export type MoveElectionToGroupRequest = {
  electionId: number;
  targetGroupId: number | null; // null to remove from group
};

export type BulkEditField =
  | "electionDate"
  | "launchDate"
  | "sundownDate"
  | "stage"
  | "settings";

export type BulkEditRequest = {
  electionIds: number[];
  field: BulkEditField;
  value: unknown;
};
