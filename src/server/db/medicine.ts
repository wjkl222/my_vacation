import { pgTable, varchar } from "drizzle-orm/pg-core";
import { commonFields } from "./utils";

export const medicalBases = pgTable("medical_bases", {
    ...commonFields,
    name: varchar("name", { length: 255 }).notNull(),
})

export const treatmentIndications = pgTable("treatment_indications", {
    ...commonFields,
    name: varchar("name", { length: 255 }).notNull(),
})