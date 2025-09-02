import { location, locationInsertSchema } from "@/lib/db/schema/location";
import db from "~/lib/db";

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

  const [created] = await db.insert(location).values({
    ...result.data,
    slug: result.data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""),
    userId: event.context.user.id,
  }).returning();

  return created;
});
