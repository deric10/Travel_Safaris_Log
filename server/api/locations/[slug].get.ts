import { findLocation } from "~/lib/db/queries/location";
import defineAuthEventHandler from "~/shared/utils/define-auth-even-thandle";

export default defineAuthEventHandler(async (event) => {
  // await new Promise(resolve => setTimeout(resolve, 2000)); // Adding delay to visualize loading behaviour
  try {
    const slug = getRouterParam(event, "slug") as string;
    const location = await findLocation(slug, event.context.user.id);

    if (!location) {
      return sendError(event, createError({
        statusCode: 404,
        statusMessage: "Location not found",
      }));
    }
    return location;
  }
  catch (error) {
    return sendError(event, createError({
      statusCode: 501,
      statusMessage: `Server Error ${error}`,
    }));
  }
});
