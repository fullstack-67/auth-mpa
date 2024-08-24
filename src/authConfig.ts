import "dotenv/config";
import { type ExpressAuthConfig } from "@auth/express";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "@auth/express/providers/credentials";
import { dbClient } from "@db/client.js";
import GitHub from "@auth/express/providers/github";

export const authConfig: ExpressAuthConfig = {
  providers: [
    GitHub({
      clientId: "",
      clientSecret: "",
    }),
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        // logic to salt and hash password
        //   const pwHash = saltAndHashPassword(credentials.password);

        // logic to verify if the user exists
        //   user = await getUserFromDb(credentials.email, pwHash);
        user = {};
        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.");
        }

        // return user object with the their profile data
        return user;
      },
    }),
  ],
  adapter: DrizzleAdapter(dbClient),
};
