import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle({ client: pool, schema });
