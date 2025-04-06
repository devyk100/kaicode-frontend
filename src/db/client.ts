import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema'; // Path to your schema.ts

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // .env loaded by your app
});

export const db = drizzle(pool, { schema });
