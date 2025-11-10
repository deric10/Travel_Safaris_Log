import { findLocations } from "~/lib/db/queries/location";
import defineAuthEventHandler from "~/shared/utils/define-auth-even-thandle";

/**
 * GET /api/locations
 *
 * Returns the list of locations for the authenticated user.
 * Requires authentication; unauthenticated requests return 401.
 *
 * Response shape should contain fields used by the client:
 * - id, name, slug, description, lat, long, and optionally locationLogs[]
 */
export default defineAuthEventHandler(async (event) => {
  // event.context.user is guaranteed by defineAuthEventHandler
  return findLocations(event.context.user.id);
});
