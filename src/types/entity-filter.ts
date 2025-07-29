import { Entity } from "./entity";

export type EntityFilter = {
  title: string;
  condition: (e: Entity) => boolean;
};

export type EntityFilters = { [filterId: string]: EntityFilter };
