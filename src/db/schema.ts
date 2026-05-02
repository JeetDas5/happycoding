import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),

  cfHandle: text("cf_handle"),
  cfVerified: boolean("cf_verified").default(false),
  cfVerificationStartedAt: timestamp("cf_verification_started_at"),

  lastSolvedDate: timestamp("last_solved_date"),
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

export const problems = pgTable("problems", {
  id: text("id").primaryKey(), // "1791A"
  contestId: integer("contest_id").notNull(),
  index: text("index").notNull(),

  name: text("name").notNull(),
  rating: integer("rating"),
  tags: text("tags").array(),

  solvedCount: integer("solved_count"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyProblems = pgTable(
  "daily_problems",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    problemId: text("problem_id").notNull(),

    date: text("date").notNull(), // YYYY-MM-DD
    difficulty: text("difficulty"), // easy | medium | hard

    problemLink: text("problem_link").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("unique_daily_problem").on(table.problemId, table.date),
  ],
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    problemId: text("problem_id").notNull(),
    status: text("status").notNull().default("unsolved"), // "solved" | "attempted" | "unsolved"
    verdict: text("verdict"), // OK
    cfSubmissionId: integer("cf_submission_id"),
    submittedAt: timestamp("submitted_at").defaultNow(),
    pointsAwarded: integer("points_awarded").default(0),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("unique_submission").on(table.userId, table.problemId),
  ],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  submissions: many(submissions),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(memberships),
}));

export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(users, {
    fields: [memberships.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [memberships.orgId],
    references: [organizations.id],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
}));
