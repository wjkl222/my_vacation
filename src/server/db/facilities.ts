import { pgTable, varchar } from "drizzle-orm/pg-core";
import { commonFields } from "./utils";

export const facilities = pgTable("facilities", {
    ...commonFields,
    name: varchar("name", { length: 255 }).notNull()
})