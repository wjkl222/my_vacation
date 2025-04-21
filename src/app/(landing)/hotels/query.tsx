import {
  parseAsArrayOf,
  parseAsString,
  parseAsInteger,
  parseAsIsoDate,
  parseAsBoolean,
} from "nuqs/server";

export const hotelFilters = {
  guests: parseAsInteger,
  startDate: parseAsIsoDate,
  endDate: parseAsIsoDate,
  rating: parseAsInteger,
  price: parseAsString,
  country: parseAsArrayOf(parseAsString).withDefault([]),
  facilities: parseAsArrayOf(parseAsString).withDefault([]),
  medicalBase: parseAsString,
  treatmentIndications: parseAsArrayOf(parseAsString).withDefault([]),
  sortPopularityUp: parseAsBoolean,
};
