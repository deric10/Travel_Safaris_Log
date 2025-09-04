import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import db from "~/lib/db/index";

import type { locationInsertSchemaType } from "../schema/location";

import { location } from "../schema/location";

export async function findLocations(userId: number) {
  return db.query.location.findMany({
    where: eq(location.userId, userId),
    orderBy: (location, { desc }) => [
      desc(location.createdAt),
    ],
  });
}

export async function findLocationByName(existing: locationInsertSchemaType, userId: number) {
  return db.query.location.findFirst({
    where: and(
      eq(location.name, existing.name),
      eq(location.userId, userId),
    ),
  });
}

export async function findLocationBySlug(originalSlug: string) {
  return await db.query.location.findFirst({
    where: eq(location.slug, originalSlug),
  });
}

export async function findUniqueSlug(slug: string) {
  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);
  let existingSlug = !!(await findLocationBySlug(slug));

  while (existingSlug) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existingSlug = !!(await findLocationBySlug(idSlug));
    if (!existingSlug) {
      return idSlug;
    }
  }

  return slug;
}

export async function insertLocation(insertable: locationInsertSchemaType, userId: number, slug: string) {
  const [created] = await db.insert(location).values({
    ...insertable,
    slug,
    userId,
  }).returning();

  return created;
}
