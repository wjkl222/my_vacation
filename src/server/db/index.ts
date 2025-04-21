import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";
import { DefaultLogger, type LogWriter } from "drizzle-orm";

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

class ConsoleLogger implements LogWriter {
  write(message: string) {
    console.log(message);
  }
}

export const db = drizzle(conn, {
  schema,
  logger: new DefaultLogger({ writer: new ConsoleLogger() }),
});
