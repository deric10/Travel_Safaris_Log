import { findLocations } from "~/lib/db/queries/location";
import defineAuthEventHandler from "~/shared/utils/define-auth-even-thandle";

export default defineAuthEventHandler(async (event) => {
  return findLocations(event.context.user.id);
});
