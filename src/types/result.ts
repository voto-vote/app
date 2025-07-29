import { Candidate } from "./candidate";
import { Party } from "./party";

export type Result<T extends Party | Candidate> = (T extends Candidate
  ? { type: "candidate"; entity: Candidate }
  : T extends Party
    ? { type: "party"; entity: Party }
    : never) & {
  matchPercentage: number;
};

export type Results = {
  partyResults: Result<Party>[];
  candidateResults: Result<Candidate>[];
};
