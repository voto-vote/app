-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "statements" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('statements_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"instance_id" serial NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exp_theses_translation" (
	"id" serial PRIMARY KEY NOT NULL,
	"these_id" serial NOT NULL,
	"locale" text NOT NULL,
	"title" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exp_theses" (
	"id" serial PRIMARY KEY NOT NULL,
	"original" text NOT NULL,
	"title" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"shareable" boolean,
	"author_instance_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exp_app_theses" (
	"id" serial PRIMARY KEY NOT NULL,
	"instance_id" serial NOT NULL,
	"these_id" serial NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"derived" boolean
);
--> statement-breakpoint
CREATE TABLE "statement_translations" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('statement_translations_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"statement_id" serial NOT NULL,
	"language_code" text NOT NULL,
	"title" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"instance_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('notifications_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"url" text NOT NULL,
	"valid_from" integer NOT NULL,
	"valid_until" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"type" integer NOT NULL,
	"election_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates_light" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('candidates_light_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"gender_id" serial NOT NULL,
	"party_id" serial NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "party_votes" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('party_votes_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"value" integer NOT NULL,
	"weight" integer NOT NULL,
	"explanation" text NOT NULL,
	"statement_id" integer NOT NULL,
	"instance_id" serial NOT NULL,
	"party_id" serial NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidate_votes" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('candidate_votes_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"value" integer NOT NULL,
	"weight" integer NOT NULL,
	"explanation" text NOT NULL,
	"statement_id" integer NOT NULL,
	"instance_id" serial NOT NULL,
	"candidate_id" serial NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parties" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('parties_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"parent_party_id" serial NOT NULL,
	"short_name" text NOT NULL,
	"detailed_name" text NOT NULL,
	"description" text NOT NULL,
	"website" text NOT NULL,
	"status" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"instance_id" serial NOT NULL,
	"logo" text,
	"public" boolean
);
--> statement-breakpoint
CREATE TABLE "genders" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('genders_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('users_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"title" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"gender_id" serial NOT NULL,
	"email" text NOT NULL,
	"job" text NOT NULL,
	"birthday" date NOT NULL,
	"phone" integer NOT NULL,
	"address1" text NOT NULL,
	"address2" text NOT NULL,
	"zipcode" text NOT NULL,
	"city" text NOT NULL,
	"status" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('admins_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"user_id" serial NOT NULL,
	"status" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "elections" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('elections_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"election_date" date NOT NULL,
	"location" text NOT NULL,
	"name" text NOT NULL,
	"status" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creators" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('creators_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"user_id" serial NOT NULL,
	"status" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"instance_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "party_agents" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('party_agents_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"user_id" serial NOT NULL,
	"party_id" serial NOT NULL,
	"status" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"instance_id" serial NOT NULL,
	CONSTRAINT "uq_partyagents" UNIQUE("user_id","instance_id")
);
--> statement-breakpoint
CREATE TABLE "instances" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('instances_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"election_id" serial NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"description" text NOT NULL,
	"url" text NOT NULL,
	"status" integer NOT NULL,
	"launch_date" timestamp NOT NULL,
	"sundown_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"live" boolean
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" integer PRIMARY KEY DEFAULT bounded_pseudo_encrypt((nextval('candidates_id_seq'::regclass))::integer, 16777215, 1000) NOT NULL,
	"user_id" serial NOT NULL,
	"party_id" serial NOT NULL,
	"description" text NOT NULL,
	"district" text NOT NULL,
	"list_place" integer NOT NULL,
	"website" text NOT NULL,
	"status" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"instance_id" serial NOT NULL,
	"public" boolean NOT NULL,
	"profile_picture" text,
	CONSTRAINT "uq_candidates" UNIQUE("user_id","instance_id")
);
--> statement-breakpoint
ALTER TABLE "statements" ADD CONSTRAINT "statements_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exp_theses_translation" ADD CONSTRAINT "exp_theses_translation_these_id_fkey" FOREIGN KEY ("these_id") REFERENCES "public"."exp_theses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exp_app_theses" ADD CONSTRAINT "exp_app_theses_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exp_app_theses" ADD CONSTRAINT "exp_app_theses_these_id_fkey" FOREIGN KEY ("these_id") REFERENCES "public"."exp_theses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_translations" ADD CONSTRAINT "statement_translations_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_translations" ADD CONSTRAINT "statement_id" FOREIGN KEY ("statement_id") REFERENCES "public"."statements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_translations" ADD CONSTRAINT "statement_translations_statement_id_fkey" FOREIGN KEY ("statement_id") REFERENCES "public"."statements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "public"."elections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates_light" ADD CONSTRAINT "candidates_light_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "public"."genders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates_light" ADD CONSTRAINT "candidates_light_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates_light" ADD CONSTRAINT "candidates_light_gender_id_fkey1" FOREIGN KEY ("gender_id") REFERENCES "public"."genders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates_light" ADD CONSTRAINT "candidates_light_party_id_fkey1" FOREIGN KEY ("party_id") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates_light" ADD CONSTRAINT "candidates_light_gender_id_fkey2" FOREIGN KEY ("gender_id") REFERENCES "public"."genders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates_light" ADD CONSTRAINT "candidates_light_party_id_fkey2" FOREIGN KEY ("party_id") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_votes" ADD CONSTRAINT "party_votes_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_votes" ADD CONSTRAINT "party_votes_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_votes" ADD CONSTRAINT "party_votes_statement_id_fkey" FOREIGN KEY ("statement_id") REFERENCES "public"."statements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_votes" ADD CONSTRAINT "candidate_votes_statement_id_fkey" FOREIGN KEY ("statement_id") REFERENCES "public"."statements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_votes" ADD CONSTRAINT "candidate_votes_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_votes" ADD CONSTRAINT "candidate_votes_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_votes" ADD CONSTRAINT "candidate_votes_candidate_id_fkey1" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_votes" ADD CONSTRAINT "candidate_votes_candidate_id_fkey2" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parties" ADD CONSTRAINT "parties_parent_party_id_fkey" FOREIGN KEY ("parent_party_id") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "public"."genders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creators" ADD CONSTRAINT "creators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_agents" ADD CONSTRAINT "party_agents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_agents" ADD CONSTRAINT "party_agents_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instances" ADD CONSTRAINT "instances_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "public"."elections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_party_vote" ON "party_votes" USING btree ("statement_id" int4_ops,"party_id" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_candidate_vote" ON "candidate_votes" USING btree ("statement_id" int4_ops,"candidate_id" int4_ops);
*/