import { Config } from "drizzle-kit";
import { Resource } from "sst";

export default {
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    database: Resource.AppDB.database,
    user: Resource.AppDB.username,
    password: Resource.AppDB.password,
    host: Resource.AppDB.host,
    port: Resource.AppDB.port,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  verbose: true,
} satisfies Config;
