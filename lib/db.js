import { Pool } from "pg";

let pool;

/**
 * Returns a singleton pg Pool.
 *
 * Configure with DATABASE_URL from Neon (Postgres).
 * Example:
 *   DATABASE_URL="postgres://user:pass@host.neon.tech/db?sslmode=require"
 */
export async function getDB() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  pool = new Pool({
    connectionString,
    // Neon requires SSL; the connection string usually includes sslmode=require.
    ssl: { rejectUnauthorized: false },
    max: 10,
  });

  return pool;
}
