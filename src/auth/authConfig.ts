import "dotenv/config";
import { type ExpressAuthConfig } from "@auth/express";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { dbClient } from "@db/client.js";
import GitHub from "@auth/express/providers/github";

export const authConfig: ExpressAuthConfig = {
  providers: [GitHub],
  adapter: DrizzleAdapter(dbClient),
};
