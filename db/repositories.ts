import { eq } from "drizzle-orm";
import { dbClient } from "@db/client.js";
import { sessionsTable } from "@db/schema.js";

export async function getAllSessions() {
  const results = await dbClient.query.sessionsTable.findMany();
  return results;
}

export async function deleteSession(sid: string) {
  return await dbClient
    .delete(sessionsTable)
    .where(eq(sessionsTable.sid, sid))
    .returning();
}
