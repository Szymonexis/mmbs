import { ENVIRONMENT } from '$env/static/private';
import { DatabaseService } from '$shared/server/database';

async function initiateSqlTables() {
	if (ENVIRONMENT === 'development') return;

	try {
		const sql = DatabaseService.init().sql;

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
	} catch (error) {
		console.error('Error initiating SQL tables:', error);
		throw error;
	}
}

initiateSqlTables();
