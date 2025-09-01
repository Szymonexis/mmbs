import { sql } from '$shared/server/database';

async function initiateSqlTables() {
	await sql`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `;

	await sql`
    CREATE TABLE IF NOT EXISTS "Visit" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "date" TIMESTAMP NOT NULL,
      "ipAddress" TEXT NOT NULL,
      "route" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "userAgent" TEXT NOT NULL
    );
  `;
}

initiateSqlTables();
