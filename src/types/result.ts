
export type Result = {
  entity_id: number;
  resultType: ResultType;
  value: number;
  matchPercentage: number;
  color: string;
  displayName: string;
};

export type ResultType = "party" | "candidate";