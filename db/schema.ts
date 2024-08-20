import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const sessionsTable = sqliteTable("sessions", {
  sid: text("sid").primaryKey(),
  expired: integer("expired"),
  sess: text("sess", { mode: "json" }),
});
