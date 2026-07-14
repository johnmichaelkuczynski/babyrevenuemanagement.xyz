---
name: connect-pg-simple esbuild bundling
description: createTableIfMissing:true breaks in esbuild-bundled production — the package reads a SQL file via a path that doesn't survive bundling.
---

# connect-pg-simple + esbuild: createTableIfMissing breaks

## The rule
Never use `createTableIfMissing: true` with connect-pg-simple when the server is bundled by esbuild. The option reads `table.sql` from its node_modules package directory at runtime; esbuild resolves that path relative to the output bundle (`dist/table.sql`) which doesn't exist.

**Symptom:** Every OAuth callback returns 500 with `ENOENT: no such file or directory, open '.../dist/table.sql'`.

**Fix:** Create the `user_sessions` table manually in the server's own `initAuthTables()` startup SQL, then omit `createTableIfMissing` from the PgSession config.

```sql
CREATE TABLE IF NOT EXISTS "user_sessions" (
  "sid" varchar NOT NULL,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "user_sessions" ("expire");
```

**Why:** esbuild bundles JS but leaves non-JS assets behind; any node_modules package that reads a sibling file at runtime will break unless that file is explicitly copied to the output directory or the feature is replaced.

**How to apply:** Whenever connect-pg-simple is used with esbuild (api-server/build.mjs), always use this manual-table approach instead of createTableIfMissing.
