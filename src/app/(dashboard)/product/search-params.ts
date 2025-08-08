import { createLoader, parseAsInteger } from "nuqs/server";

export const coordinatesSearchParams = {
  page: parseAsInteger.withDefault(0),
  perPage: parseAsInteger.withDefault(10),
};

export const loadSearchParams = createLoader(coordinatesSearchParams);
