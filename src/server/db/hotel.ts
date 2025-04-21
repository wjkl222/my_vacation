
import { commonFields } from "./utils";
import { relations } from "drizzle-orm";
import { bookings } from "./bookings";
import { medicalBases, treatmentIndications } from "./medicine";
import { facilities } from "./facilities";
import { user } from "./user";
import { boolean, decimal, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const ratingType = pgEnum("rating_type", ["like", "dislike"]);

export const hotels = pgTable("hotel", {
    ...commonFields,
    name: varchar("name", { length: 255 }).notNull(),
    country: varchar("country", { length: 255 }).notNull(),
    description: text("description").notNull(),
    rating: decimal("rating", { precision: 3, scale: 1 }).notNull(),
    image: text("image").notNull(),
    medicalBase: varchar("medicalBase", { length: 255 })
        .notNull()
        .references(() => medicalBases.id),
    isFeatured: boolean("is_featured").notNull(),
    isDeleted: boolean("is_deleted").notNull().default(false),
    likesCount: integer("likes_count").notNull().default(0),
    dislikesCount: integer("dislikes_count").notNull().default(0),
});


export const hotelRating = pgTable("hotel_rating", {
    id: varchar("id", { length: 255 })
        .primaryKey()
        .notNull()
        .$defaultFn(() => crypto.randomUUID()),
    hotelId: varchar("hotel_id", { length: 255 })
        .notNull()
        .references(() => hotels.id),
    userId: varchar("user_id", { length: 255 })
        .notNull()
        .references(() => user.id),
    type: ratingType("type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});


export const hotelsToFacilities = pgTable("hotels_to_facilities", {
    hotelId: varchar("hotel_id", { length: 255 })
        .notNull()
        .references(() => hotels.id),
    facilityId: varchar("facility_id", { length: 255 })
        .notNull()
        .references(() => facilities.id),
});


export const hotelsToTreatmentIndications = pgTable(
    "hotels_to_treatment_indications",
    {
        hotelId: varchar("hotel_id", { length: 255 })
            .notNull()
            .references(() => hotels.id),
        treatmentIndicationId: varchar("treatment_indication_id", { length: 255 })
            .notNull()
            .references(() => treatmentIndications.id),
    }
);

export const hotelsRelations = relations(hotels, ({ many, one }) => ({
    rooms: many(hotelRooms),
    treatmentIndications: many(hotelsToTreatmentIndications),
    facilities: many(hotelsToFacilities),
    medicalBase: one(medicalBases, {
        fields: [hotels.medicalBase],
        references: [medicalBases.id],
    }),
}));

export const hotelsToTreatmentIndicationsRelations = relations(
    hotelsToTreatmentIndications,
    ({ one }) => ({
        hotel: one(hotels, {
            fields: [hotelsToTreatmentIndications.hotelId],
            references: [hotels.id],
        }),
        treatmentIndication: one(treatmentIndications, {
            fields: [hotelsToTreatmentIndications.treatmentIndicationId],
            references: [treatmentIndications.id],
        }),
    })
);

export const hotelsToFacilitiesRelations = relations(
    hotelsToFacilities,
    ({ one }) => ({
        hotel: one(hotels, {
            fields: [hotelsToFacilities.hotelId],
            references: [hotels.id],
        }),
        facility: one(facilities, {
            fields: [hotelsToFacilities.facilityId],
            references: [facilities.id],
        }),
    })
);

export const hotelRooms = pgTable("hotel_room", {
    ...commonFields,

    name: varchar("name", { length: 255 }).notNull(),
    image: text("image").notNull(),
    hotelId: varchar("hotel_id", { length: 255 })
        .notNull()
        .references(() => hotels.id),
    size: integer("size").notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    pricePerNight: integer("price_per_night").notNull(),
    isFeatured: boolean("is_featured").notNull().default(false),
    isDeleted: boolean("is_deleted").notNull().default(false),
});

export const hotelRoomsRelations = relations(hotelRooms, ({ one, many }) => ({
    hotel: one(hotels, {
        fields: [hotelRooms.hotelId],
        references: [hotels.id],
    }),
    bookings: many(bookings),
    facilities: many(facilities),
}));
