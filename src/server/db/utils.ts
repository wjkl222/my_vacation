import { varchar, timestamp } from "drizzle-orm/pg-core";

export const commonFields = {
    id: varchar("id", { length: 255 })
        .primaryKey()
        .notNull()
        .$defaultFn(() => crypto.randomUUID()),
    createdAt: timestamp("created_at").notNull().defaultNow(),
};
