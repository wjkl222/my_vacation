import { migrate } from "drizzle-orm/pglite/migrator";
import { db } from ".";
import { sql } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";

await migrate(db, {
  migrationsFolder: "./drizzle/",
});

console.log("Migration complete");