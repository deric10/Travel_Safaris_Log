import type z from "zod";

// Database table schema
import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";

export const location = sqliteTable("location", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
  unique().on(t.name, t.userId),
]);

export const locationInsertSchema = createInsertSchema(location, {
  name: field => field.min(3, { message: "Name should be at least 3 characters long" }).max(100, { message: "Name should be at most 100 characters long" }),
  description: field => field.max(1000, { message: "Description should be at most 1000 characters long" }),
  lat: field => field.min(-90, { message: "Latitude must be between -90 and 90" }).max(90, { message: "Latitude must be between -90 and 90" }),
  long: field => field.min(-180, { message: "Longitude must be between -180 and 180" }).max(180, { message: "Longitude must be between -180 and 180" }),
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type locationInsertSchemaType = z.infer<typeof locationInsertSchema>;
