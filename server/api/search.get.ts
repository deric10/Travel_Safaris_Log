import z from "zod";

import type { NominatimResults } from "~/lib/types";

import defineAuthEventHandler from "~/shared/utils/define-auth-even-thandle";
import sendZodError from "~/shared/utils/send-zod-error";
import { SearchSchema } from "~/shared/utils/zod-schemas";

export default defineAuthEventHandler(
  defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, SearchSchema.safeParse);

    if (!result.success) {
      return sendZodError(event, result.error);
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {
        signal: AbortSignal.timeout(7000),
        headers: {
          "User-Agent": "nuxt-travel-log | derickalfred38@gmail.com",
        },
      });

      if (!response.ok) {
        return sendError(event, createError({
          statusCode: 504,
          statusMessage: "Un-able to reach search API",
        }));
      }

      const results = await response.json() as NominatimResults[];
      return results;
    }
    catch {
      return sendError(event, createError({
        statusCode: 504,
        statusMessage: "Un-able to reach search API (TimeOut)",
      }));
    }
  }, { maxAge: 60 * 60 * 24, name: "search-nomination", getKey: async (event) => {
    const query = await getQuery(event);
    return query.q?.toString() || "";
  } }),
);
