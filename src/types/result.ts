import { Entity } from "./entity";

export type Result = {
  entity: Entity;
  matchPercentage: number;
};

export type Results = Result[];
