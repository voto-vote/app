import { pgTable, foreignKey, integer, serial, timestamp, text, boolean, uniqueIndex, date, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const statements = pgTable("statements", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('statements_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	instanceId: serial("instance_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.instanceId],
		foreignColumns: [instances.id],
		name: "statements_instance_id_fkey"
	}),
]);

export const expThesesTranslation = pgTable("exp_theses_translation", {
	id: serial().primaryKey().notNull(),
	theseId: serial("these_id").notNull(),
	locale: text().notNull(),
	title: text().notNull(),
	text: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.theseId],
		foreignColumns: [expTheses.id],
		name: "exp_theses_translation_these_id_fkey"
	}),
]);

export const expTheses = pgTable("exp_theses", {
	id: serial().primaryKey().notNull(),
	original: text().notNull(),
	title: text().notNull(),
	text: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	shareable: boolean(),
	authorInstanceId: serial("author_instance_id").notNull(),
});

export const expAppTheses = pgTable("exp_app_theses", {
	id: serial().primaryKey().notNull(),
	instanceId: serial("instance_id").notNull(),
	theseId: serial("these_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	derived: boolean(),
}, (table) => [
	foreignKey({
		columns: [table.instanceId],
		foreignColumns: [instances.id],
		name: "exp_app_theses_instance_id_fkey"
	}),
	foreignKey({
		columns: [table.theseId],
		foreignColumns: [expTheses.id],
		name: "exp_app_theses_these_id_fkey"
	}),
]);

export const statementTranslations = pgTable("statement_translations", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('statement_translations_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	statementId: serial("statement_id").notNull(),
	languageCode: text("language_code").notNull(),
	title: text().notNull(),
	text: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	instanceId: serial("instance_id").notNull(),
}, (table) => [
	foreignKey({
		columns: [table.instanceId],
		foreignColumns: [instances.id],
		name: "statement_translations_instance_id_fkey"
	}),
	foreignKey({
		columns: [table.statementId],
		foreignColumns: [statements.id],
		name: "statement_id"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.statementId],
		foreignColumns: [statements.id],
		name: "statement_translations_statement_id_fkey"
	}).onDelete("cascade"),
]);

export const notifications = pgTable("notifications", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('notifications_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	url: text().notNull(),
	validFrom: integer("valid_from").notNull(),
	validUntil: integer("valid_until").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	type: integer().notNull(),
	electionId: integer("election_id").notNull(),
}, (table) => [
	foreignKey({
		columns: [table.electionId],
		foreignColumns: [elections.id],
		name: "notifications_election_id_fkey"
	}),
]);

export const candidatesLight = pgTable("candidates_light", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('candidates_light_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	genderId: serial("gender_id").notNull(),
	partyId: serial("party_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.genderId],
		foreignColumns: [genders.id],
		name: "candidates_light_gender_id_fkey"
	}),
	foreignKey({
		columns: [table.partyId],
		foreignColumns: [parties.id],
		name: "candidates_light_party_id_fkey"
	}),
	foreignKey({
		columns: [table.genderId],
		foreignColumns: [genders.id],
		name: "candidates_light_gender_id_fkey1"
	}),
	foreignKey({
		columns: [table.partyId],
		foreignColumns: [parties.id],
		name: "candidates_light_party_id_fkey1"
	}),
	foreignKey({
		columns: [table.genderId],
		foreignColumns: [genders.id],
		name: "candidates_light_gender_id_fkey2"
	}),
	foreignKey({
		columns: [table.partyId],
		foreignColumns: [parties.id],
		name: "candidates_light_party_id_fkey2"
	}),
]);

export const partyVotes = pgTable("party_votes", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('party_votes_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	value: integer().notNull(),
	weight: integer().notNull(),
	explanation: text().notNull(),
	statementId: integer("statement_id").notNull(),
	instanceId: serial("instance_id").notNull(),
	partyId: serial("party_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("idx_party_vote").using("btree", table.statementId.asc().nullsLast().op("int4_ops"), table.partyId.asc().nullsLast().op("int4_ops")),
	foreignKey({
		columns: [table.instanceId],
		foreignColumns: [instances.id],
		name: "party_votes_instance_id_fkey"
	}),
	foreignKey({
		columns: [table.partyId],
		foreignColumns: [parties.id],
		name: "party_votes_party_id_fkey"
	}),
	foreignKey({
		columns: [table.statementId],
		foreignColumns: [statements.id],
		name: "party_votes_statement_id_fkey"
	}).onDelete("cascade"),
]);

export const candidateVotes = pgTable("candidate_votes", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('candidate_votes_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	value: integer().notNull(),
	weight: integer().notNull(),
	explanation: text().notNull(),
	statementId: integer("statement_id").notNull(),
	instanceId: serial("instance_id").notNull(),
	candidateId: serial("candidate_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("idx_candidate_vote").using("btree", table.statementId.asc().nullsLast().op("int4_ops"), table.candidateId.asc().nullsLast().op("int4_ops")),
	foreignKey({
		columns: [table.statementId],
		foreignColumns: [statements.id],
		name: "candidate_votes_statement_id_fkey"
	}),
	foreignKey({
		columns: [table.instanceId],
		foreignColumns: [instances.id],
		name: "candidate_votes_instance_id_fkey"
	}),
	foreignKey({
		columns: [table.candidateId],
		foreignColumns: [candidates.id],
		name: "candidate_votes_candidate_id_fkey"
	}),
	foreignKey({
		columns: [table.candidateId],
		foreignColumns: [candidates.id],
		name: "candidate_votes_candidate_id_fkey1"
	}),
	foreignKey({
		columns: [table.candidateId],
		foreignColumns: [candidates.id],
		name: "candidate_votes_candidate_id_fkey2"
	}),
]);

export const parties = pgTable("parties", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('parties_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	parentPartyId: serial("parent_party_id").notNull(),
	shortName: text("short_name").notNull(),
	detailedName: text("detailed_name").notNull(),
	description: text().notNull(),
	website: text().notNull(),
	status: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	instanceId: serial("instance_id").notNull(),
	logo: text(),
	public: boolean(),
}, (table) => [
	foreignKey({
		columns: [table.parentPartyId],
		foreignColumns: [table.id],
		name: "parties_parent_party_id_fkey"
	}),
]);

export const genders = pgTable("genders", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('genders_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	displayName: text("display_name").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const users = pgTable("users", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('users_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	title: text().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	genderId: serial("gender_id").notNull(),
	email: text().notNull(),
	job: text().notNull(),
	birthday: date().notNull(),
	phone: integer().notNull(),
	address1: text().notNull(),
	address2: text().notNull(),
	zipcode: text().notNull(),
	city: text().notNull(),
	status: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.genderId],
		foreignColumns: [genders.id],
		name: "users_gender_id_fkey"
	}),
]);

export const admins = pgTable("admins", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('admins_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	userId: serial("user_id").notNull(),
	status: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "admins_user_id_fkey"
	}),
]);

export const elections = pgTable("elections", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('elections_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	electionDate: date("election_date").notNull(),
	location: text().notNull(),
	name: text().notNull(),
	status: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const creators = pgTable("creators", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('creators_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	userId: serial("user_id").notNull(),
	status: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	instanceId: serial("instance_id").notNull(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "creators_user_id_fkey"
	}),
]);

export const partyAgents = pgTable("party_agents", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('party_agents_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	userId: serial("user_id").notNull(),
	partyId: serial("party_id").notNull(),
	status: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	instanceId: serial("instance_id").notNull(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "party_agents_user_id_fkey"
	}),
	foreignKey({
		columns: [table.partyId],
		foreignColumns: [parties.id],
		name: "party_agents_party_id_fkey"
	}),
	unique("uq_partyagents").on(table.userId, table.instanceId),
]);

export const instances = pgTable("instances", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('instances_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	electionId: serial("election_id").notNull(),
	title: text().notNull(),
	subtitle: text().notNull(),
	description: text().notNull(),
	url: text().notNull(),
	status: integer().notNull(),
	launchDate: timestamp("launch_date", { mode: 'string' }).notNull(),
	sundownDate: timestamp("sundown_date", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	live: boolean(),
}, (table) => [
	foreignKey({
		columns: [table.electionId],
		foreignColumns: [elections.id],
		name: "instances_election_id_fkey"
	}),
]);

export const candidates = pgTable("candidates", {
	id: integer().default(sql`bounded_pseudo_encrypt((nextval('candidates_id_seq'::regclass))::integer, 16777215, 1000)`).primaryKey().notNull(),
	userId: serial("user_id").notNull(),
	partyId: serial("party_id").notNull(),
	description: text().notNull(),
	district: text().notNull(),
	listPlace: integer("list_place").notNull(),
	website: text().notNull(),
	status: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	instanceId: serial("instance_id").notNull(),
	public: boolean().notNull(),
	profilePicture: text("profile_picture"),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "candidates_user_id_fkey"
	}),
	foreignKey({
		columns: [table.partyId],
		foreignColumns: [parties.id],
		name: "candidates_party_id_fkey"
	}),
	unique("uq_candidates").on(table.userId, table.instanceId),
]);
