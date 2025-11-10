import { relations } from "drizzle-orm";
// Database table schema
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";
import { location } from "./location";

/**
 * locationLog schema
 *
 * Tracks visits/log entries associated with a location and user.
 * Times are stored as epoch milliseconds.
 */
export const locationLog = sqliteTable("locationLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  started_At: int().notNull(), // epoch ms
  ended_At: int().notNull(), // epoch ms
  lat: real().notNull(),
  long: real().notNull(),
  userId: int().notNull().references(() => user.id),
  locationId: int().notNull().references(() => location.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

/**
 * Relations:
 * - Each log belongs to a single location.
 */
export const locationLogRelations = relations(locationLog, ({ one }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
}));
