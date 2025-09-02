import type { DrizzleError } from "drizzle-orm";

import slugify from "slugify";

import { locationInsertSchema } from "@/lib/db/schema/location";
import { findLocationByName, findUniqueSlug, insertLocation } from "~/lib/db/queries/location";

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

  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: `You already have a location with the name "${result.data.name}"`,
    }));
  }

  const returnedSlug = await findUniqueSlug(slugify(result.data.name, { lower: true, strict: true, trim: true }));

  if (!returnedSlug) {
    return sendError(event, createError({
      statusCode: 100,
      statusMessage: "Failed to generate a unique slug for the location.",
    }));
  }

  try {
    return insertLocation(result.data, event.context.user.id, returnedSlug);
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
