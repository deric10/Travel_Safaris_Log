import type { H3Event } from "h3";
import type { ZodError } from "zod";

export default function sendZodError(event: H3Event, error: ZodError) {
  const statusMessage = error
    .issues
    .map(issue => `${issue.path.join(", ")} : ${issue.message}`)
    .join("; ");

  const data = error
    .issues
    .reduce((error, issue) => {
      error[issue.path.join(".")] = issue.message;
      return error;
    }, {} as Record<string, string>);

  return sendError(event, createError({
    statusCode: 422,
    statusMessage,
    data,
  }));
}
