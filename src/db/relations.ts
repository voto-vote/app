import { relations } from "drizzle-orm/relations";
import {
  instances,
  statements,
  expTheses,
  expThesesTranslation,
  expAppTheses,
  statementTranslations,
  elections,
  notifications,
  genders,
  candidatesLight,
  parties,
  partyVotes,
  candidateVotes,
  candidates,
  users,
  admins,
  creators,
  partyAgents,
} from "./schema";

export const statementsRelations = relations(statements, ({ one, many }) => ({
  instance: one(instances, {
    fields: [statements.instanceId],
    references: [instances.id],
  }),
  statementTranslations_statementId: many(statementTranslations, {
    relationName: "statementTranslations_statementId_statements_id",
  }),
  partyVotes: many(partyVotes),
  candidateVotes: many(candidateVotes),
}));

export const instancesRelations = relations(instances, ({ one, many }) => ({
  statements: many(statements),
  expAppTheses: many(expAppTheses),
  statementTranslations: many(statementTranslations),
  partyVotes: many(partyVotes),
  candidateVotes: many(candidateVotes),
  election: one(elections, {
    fields: [instances.electionId],
    references: [elections.id],
  }),
}));

export const expThesesTranslationRelations = relations(
  expThesesTranslation,
  ({ one }) => ({
    expThesis: one(expTheses, {
      fields: [expThesesTranslation.theseId],
      references: [expTheses.id],
    }),
  }),
);

export const expThesesRelations = relations(expTheses, ({ many }) => ({
  expThesesTranslations: many(expThesesTranslation),
  expAppTheses: many(expAppTheses),
}));

export const expAppThesesRelations = relations(expAppTheses, ({ one }) => ({
  instance: one(instances, {
    fields: [expAppTheses.instanceId],
    references: [instances.id],
  }),
  expThesis: one(expTheses, {
    fields: [expAppTheses.theseId],
    references: [expTheses.id],
  }),
}));

export const statementTranslationsRelations = relations(
  statementTranslations,
  ({ one }) => ({
    instance: one(instances, {
      fields: [statementTranslations.instanceId],
      references: [instances.id],
    }),
    statement_statementId: one(statements, {
      fields: [statementTranslations.statementId],
      references: [statements.id],
      relationName: "statementTranslations_statementId_statements_id",
    }),
  }),
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  election: one(elections, {
    fields: [notifications.electionId],
    references: [elections.id],
  }),
}));

export const electionsRelations = relations(elections, ({ many }) => ({
  notifications: many(notifications),
  instances: many(instances),
}));

export const candidatesLightRelations = relations(
  candidatesLight,
  ({ one }) => ({
    gender_genderId: one(genders, {
      fields: [candidatesLight.genderId],
      references: [genders.id],
      relationName: "candidatesLight_genderId_genders_id",
    }),
    party_partyId: one(parties, {
      fields: [candidatesLight.partyId],
      references: [parties.id],
      relationName: "candidatesLight_partyId_parties_id",
    }),
  }),
);

export const gendersRelations = relations(genders, ({ many }) => ({
  candidatesLights_genderId: many(candidatesLight, {
    relationName: "candidatesLight_genderId_genders_id",
  }),
  users: many(users),
}));

export const partiesRelations = relations(parties, ({ one, many }) => ({
  candidatesLights_partyId: many(candidatesLight, {
    relationName: "candidatesLight_partyId_parties_id",
  }),
  partyVotes: many(partyVotes),
  party: one(parties, {
    fields: [parties.parentPartyId],
    references: [parties.id],
    relationName: "parties_parentPartyId_parties_id",
  }),
  parties: many(parties, {
    relationName: "parties_parentPartyId_parties_id",
  }),
  partyAgents: many(partyAgents),
  candidates: many(candidates),
}));

export const partyVotesRelations = relations(partyVotes, ({ one }) => ({
  instance: one(instances, {
    fields: [partyVotes.instanceId],
    references: [instances.id],
  }),
  party: one(parties, {
    fields: [partyVotes.partyId],
    references: [parties.id],
  }),
  statement: one(statements, {
    fields: [partyVotes.statementId],
    references: [statements.id],
  }),
}));

export const candidateVotesRelations = relations(candidateVotes, ({ one }) => ({
  statement: one(statements, {
    fields: [candidateVotes.statementId],
    references: [statements.id],
  }),
  instance: one(instances, {
    fields: [candidateVotes.instanceId],
    references: [instances.id],
  }),
  candidate_candidateId: one(candidates, {
    fields: [candidateVotes.candidateId],
    references: [candidates.id],
    relationName: "candidateVotes_candidateId_candidates_id",
  }),
}));

export const candidatesRelations = relations(candidates, ({ one, many }) => ({
  candidateVotes_candidateId: many(candidateVotes, {
    relationName: "candidateVotes_candidateId_candidates_id",
  }),
  user: one(users, {
    fields: [candidates.userId],
    references: [users.id],
  }),
  party: one(parties, {
    fields: [candidates.partyId],
    references: [parties.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  gender: one(genders, {
    fields: [users.genderId],
    references: [genders.id],
  }),
  admins: many(admins),
  creators: many(creators),
  partyAgents: many(partyAgents),
  candidates: many(candidates),
}));

export const adminsRelations = relations(admins, ({ one }) => ({
  user: one(users, {
    fields: [admins.userId],
    references: [users.id],
  }),
}));

export const creatorsRelations = relations(creators, ({ one }) => ({
  user: one(users, {
    fields: [creators.userId],
    references: [users.id],
  }),
}));

export const partyAgentsRelations = relations(partyAgents, ({ one }) => ({
  user: one(users, {
    fields: [partyAgents.userId],
    references: [users.id],
  }),
  party: one(parties, {
    fields: [partyAgents.partyId],
    references: [parties.id],
  }),
}));
