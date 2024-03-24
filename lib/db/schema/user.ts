import { relations, sql } from "drizzle-orm"
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { USER_ROLE } from "@/lib/validation/user"
import { articleAuthors, articleEditors } from "./article"
import { userLinks } from "./user-link"

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  name: text("name"),
  username: text("username").unique(),
  image: text("image"),
  phoneNumber: text("phone_number"),
  about: text("about"),
  role: text("role", { enum: USER_ROLE }).default("user"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const accounts = sqliteTable(
  "accounts",
  {
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.providerAccountId],
    }),
  }),
)

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  links: many(userLinks),
  articleAuthors: many(articleAuthors),
  articleEditors: many(articleEditors),
}))

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect
