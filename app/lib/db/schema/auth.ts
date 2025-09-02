import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: int({ mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text(),
  createdAt: int().notNull(),
  updatedAt: int().notNull(),
});

export const session = sqliteTable("session", {
  id: int().primaryKey({ autoIncrement: true }),
  expiresAt: int().notNull(),
  token: text().notNull().unique(),
  createdAt: int().notNull(),
  updatedAt: int().notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: int()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: int().primaryKey({ autoIncrement: true }),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: int()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: int(),
  refreshTokenExpiresAt: int(),
  scope: text(),
  password: text(),
  createdAt: int().notNull(),
  updatedAt: int().notNull(),
});

export const verification = sqliteTable("verification", {
  id: int().primaryKey({ autoIncrement: true }),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: int().notNull(),
  createdAt: int().notNull(),
  updatedAt: int().notNull(),
});
