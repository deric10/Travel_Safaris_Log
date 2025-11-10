import type { UserWithId } from "~/lib/auth";

import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  /**
   * Middleware: Attach authenticated user to event context and guard dashboard routes.
   *
   * - Retrieves the current session via Better Auth using request headers.
   * - Attaches `event.context.user` so downstream handlers can trust-auth.
   * - Redirects unauthenticated users away from protected `/dashboard` pages.
   *
   * Note:
   * - If you need API-level protection, also use the `defineAuthEventHandler` wrapper
   *   for individual route handlers in `server/api/*`.
   */
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  // Expose the user on the Nitro event context for subsequent handlers
  event.context.user = session?.user as unknown as UserWithId;

  // Simple route-guard for dashboard pages
  if (event.path.startsWith("/dashboard")) {
    if (!session) {
      await sendRedirect(event, "/", 302);
    }
  }
});
