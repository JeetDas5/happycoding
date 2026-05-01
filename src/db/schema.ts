import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),

  cfHandle: text("cf_handle"), // add later

  points: integer("points").default(0),
  streak: integer("streak").default(0),

  createdAt: timestamp("created_at").defaultNow(),
});

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  inviteCode: text("invite_code").unique().notNull(),

  createdBy: uuid("created_by").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id").notNull(),
    orgId: uuid("org_id").notNull(),

    role: text("role").default("member"), // leader | admin | member

    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (table) => [uniqueIndex("unique_membership").on(table.userId, table.orgId)],
);

export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
});

