import { parseAsIsoDate, parseAsInteger } from "nuqs/server";

export const hotelFilters = {
  startDate: parseAsIsoDate,
  endDate: parseAsIsoDate,
  guests: parseAsInteger,
};
