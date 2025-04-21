import type { InferTreatyReturnType } from "./utils";
import type { api } from "~/server/api";

export type Hotel = InferTreatyReturnType<
  typeof api.hotels.index.get
>["hotels"][number];

export type OneHotel = InferTreatyReturnType<
  ReturnType<typeof api.hotels>["get"]
>;

export type Room = InferTreatyReturnType<
  typeof api.hotels.rooms.featured.get
>["rooms"][number];

export type FilterValues = InferTreatyReturnType<
  typeof api.hotels.filterValues.get
>;

export type Booking = InferTreatyReturnType<
  ReturnType<ReturnType<typeof api.hotels>["rooms"]>["bookings"]["get"]
>["bookings"][number];

export type BookingWithHotels = InferTreatyReturnType<typeof api.bookings.index.get>[number]

// export type RoomWithBookings = InferTreatyReturnType<typeof api.hotels.withBookings.get>["rooms"][number]
