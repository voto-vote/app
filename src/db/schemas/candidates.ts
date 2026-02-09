import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "@/db/schemas/auth";

export const genderEnum = pgEnum("gender", [
  "female",
  "male",
  "other",
  "prefer-not-to-say",
]);

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  gender: genderEnum(),
  avatarImage: text("avatar_image"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
