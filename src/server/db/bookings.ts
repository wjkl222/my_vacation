import {
    pgEnum,
    pgTable,
    varchar,
    integer,
    boolean,
    timestamp,
    text,
} from "drizzle-orm/pg-core";
import { commonFields } from "./utils";
import { hotelRooms, hotels } from "./hotel";
import { relations } from "drizzle-orm";
import { user } from "./user";

export const paymentStatuses = [
    "pending",
    "waiting_for_capture",
    "succeeded",
    "canceled",
] as const;

export const paymentStatusesEnum = pgEnum("payment_status", paymentStatuses);

export const bookings = pgTable("bookings", {
    ...commonFields,
    user: varchar("user_id", { length: 255 })
        .notNull()
        .references(() => user.id),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 255 }).notNull(),
    additionalInfo: text("additional_info").notNull().default(""),
    guests: integer("guests").notNull(),

    hotelId: varchar("hotel_id", { length: 255 })
        .notNull()
        .references(() => hotels.id),
    roomId: varchar("room_id", { length: 255 })
        .notNull()
        .references(() => hotelRooms.id),

    isActive: boolean("is_active").notNull().default(false),
    price: integer("price").notNull()
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
    hotel: one(hotels, {
        fields: [bookings.hotelId],
        references: [hotels.id],
    }),
    room: one(hotelRooms, {
        fields: [bookings.roomId],
        references: [hotelRooms.id],
    }),
    user: one(user, {
        fields: [bookings.user],
        references: [user.id]
    })
}));

