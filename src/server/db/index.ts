import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { Resource } from "sst";

const pool = new Pool({
  database: Resource.AppDB.database,
  user: Resource.AppDB.username,
  password: Resource.AppDB.password,
  host: Resource.AppDB.host,
  port: Resource.AppDB.port,
  ssl: {
    rejectUnauthorized: false,
  },
});

const db = drizzle(pool, { logger: Resource.App.stage !== "production" });
export default db;

export const enumToPgEnum = <T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] => {
  return Object.values(myEnum).map((value) => `${value}`) as any;
};
