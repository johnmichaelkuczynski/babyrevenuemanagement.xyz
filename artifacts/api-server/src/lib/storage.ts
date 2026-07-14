import { pool } from "@workspace/db";

export type AuthUser = {
  id: number;
  username: string;
  googleId: string | null;
  email: string | null;
  displayName: string | null;
};

type Visit = {
  id: number;
  email: string | null;
  visitedAt: Date;
};

async function initAuthTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      google_id TEXT UNIQUE,
      email TEXT UNIQUE,
      display_name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      email TEXT,
      visited_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS "user_sessions" (
      "sid" varchar NOT NULL,
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
    );
    CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "user_sessions" ("expire");
  `);
}

initAuthTables().catch((err) =>
  console.error("Auth table init failed:", err),
);

export const storage = {
  async getUserById(id: number): Promise<AuthUser | null> {
    const { rows } = await pool.query<AuthUser>(
      `SELECT id, username, google_id AS "googleId", email, display_name AS "displayName"
       FROM users WHERE id = $1`,
      [id],
    );
    return rows[0] ?? null;
  },

  async getUserByGoogleId(googleId: string): Promise<AuthUser | null> {
    const { rows } = await pool.query<AuthUser>(
      `SELECT id, username, google_id AS "googleId", email, display_name AS "displayName"
       FROM users WHERE google_id = $1`,
      [googleId],
    );
    return rows[0] ?? null;
  },

  async getUserByEmail(email: string): Promise<AuthUser | null> {
    const { rows } = await pool.query<AuthUser>(
      `SELECT id, username, google_id AS "googleId", email, display_name AS "displayName"
       FROM users WHERE email = $1`,
      [email],
    );
    return rows[0] ?? null;
  },

  async createUserWithGoogle(data: {
    username: string;
    googleId: string;
    email: string | null;
    displayName: string | null;
  }): Promise<AuthUser> {
    const { rows } = await pool.query<AuthUser>(
      `INSERT INTO users (username, google_id, email, display_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, google_id AS "googleId", email, display_name AS "displayName"`,
      [data.username, data.googleId, data.email, data.displayName],
    );
    return rows[0]!;
  },

  async updateUserGoogle(
    id: number,
    data: { googleId?: string; displayName?: string | null },
  ): Promise<AuthUser> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    if (data.googleId !== undefined) {
      sets.push(`google_id = $${i++}`);
      values.push(data.googleId);
    }
    if (data.displayName !== undefined) {
      sets.push(`display_name = $${i++}`);
      values.push(data.displayName);
    }
    values.push(id);
    const { rows } = await pool.query<AuthUser>(
      `UPDATE users SET ${sets.join(", ")} WHERE id = $${i}
       RETURNING id, username, google_id AS "googleId", email, display_name AS "displayName"`,
      values,
    );
    return rows[0]!;
  },

  async recordVisit(userId: number, email: string | null): Promise<void> {
    await pool.query(
      `INSERT INTO visits (user_id, email) VALUES ($1, $2)`,
      [userId, email],
    );
  },

  async getVisits(limit: number): Promise<Visit[]> {
    const { rows } = await pool.query<Visit>(
      `SELECT id, email, visited_at AS "visitedAt" FROM visits ORDER BY visited_at DESC LIMIT $1`,
      [limit],
    );
    return rows;
  },

  async getVisitTimestampsSince(_since: null): Promise<string[]> {
    const { rows } = await pool.query<{ visitedAt: Date }>(
      `SELECT visited_at AS "visitedAt" FROM visits ORDER BY visited_at`,
    );
    return rows.map((r) => r.visitedAt.toISOString());
  },
};
