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
import { headers } from "next/headers";

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
   user: {
      additionalFields: {
        likes: {
          type: "string",
          required: false,
          defaultValue: "",
        }
      },
    },
});

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];

export const getAuth = async (): Promise<Session | null> => {
  return auth.api.getSession({
    headers: await headers(),
  });
};



