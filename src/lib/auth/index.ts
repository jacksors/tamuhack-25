import { betterAuth } from "better-auth";
import { Resource } from "sst";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  accountsTable,
  sessionsTable,
  usersTable,
  verificationsTable,
} from "@/server/db/schema";
import db from "@/server/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: usersTable,
      session: sessionsTable,
      account: accountsTable,
      verification: verificationsTable,
    },
  }),
  socialProviders: {
    google: {
      clientId: Resource.GOOGLE_CLIENT_ID.value,
      clientSecret: Resource.GOOGLE_CLIENT_SECRET.value,
    },
  },
});
