import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL ?? "";

const sql = neon(databaseUrl);
const db = drizzle(sql);

export { db };
