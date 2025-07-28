import { Candidate } from "./candidate";
import { Party } from "./party";

export type Result<T> = {
  entity: T;
  matchPercentage: number;
};

export type Results = {
  partyResults: Result<Party>[];
  candidateResults: Result<Candidate>[];
};
