import type { H3Event, H3EventContext } from "h3";

import type { UserWithId } from "~/lib/auth";

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: UserWithId;
  };
};
/**
 * defineAuthEventHandler
 *
 * Higher-order event handler that enforces authentication for Nitro routes.
 * - If `event.context.user` is missing, responds with 401 Unauthorized.
 * - Otherwise, delegates to the provided `handler`.
 *
 * Usage:
 *   export default defineAuthEventHandler((event) => { ... })
 *
 * Tip:
 *   Ensure an auth middleware (e.g., server/middleware/auth.ts) populates `event.context.user`.
 */

export default function defineAuthEventHandler<T>(handler: (event: AuthenticatedEvent) => T) {
  return defineEventHandler(async (event) => {
    if (!event.context.user) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      }));
    }
    return handler(event as AuthenticatedEvent);
  });
};
