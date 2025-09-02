import type { DrizzleError } from "drizzle-orm";

import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slugify";

import db from "@/lib/db/index";
import { location, locationInsertSchema } from "@/lib/db/schema/location";

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, locationInsertSchema.safeParse);
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }

  if (!result.success) {
    const statusMessage = result.error.issues.map(issue => `${issue.path.join(", ")} : ${issue.message}`).join("; ");
    const data = result.error.issues.reduce((error, issue) => {
      error[issue.path.join(".")] = issue.message;
      return error;
    }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 400,
      statusMessage,
      data,
    }));
  }

  let originalSlug = slugify(result.data.name, { lower: true, strict: true, trim: true });

  const existingLocation = await db.query.location.findFirst({
    where:
    and(
      eq(location.name, result.data.name),
      eq(location.userId, event.context.user.id),
    ),
  });

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: `You already have a location with the name "${result.data.name}"`,
    }));
  }

  const existing = !!(await db.query.location.findFirst({
    where: eq(location.slug, originalSlug),
  }));

  if (existing) {
    const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);
    originalSlug += `-${nanoid()}`;
  }

  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      slug: originalSlug,
      userId: event.context.user.id,
    }).returning();

    return created;
  }
  catch (e) {
    const error = e as DrizzleError;
    if (error.message.includes("Failed query")) {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: `Slug must be unique ( the location name is used to generate the slug )`,
        data: error,
      }));
    }
    throw error;
  }
});
