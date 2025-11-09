import { ENVIRONMENT } from '$env/static/private';
import { DatabaseService } from '$shared/server/database';

async function initiateSqlTables() {
	if (ENVIRONMENT === 'development') return;

	const maxRetries = 3;
	let retryCount = 0;
	let lastError: Error | null = null;

	while (retryCount < maxRetries) {
		try {
			const sql = DatabaseService.init().sql;

			const isConnected = await DatabaseService.testConnection();
			if (!isConnected) {
				throw new Error('Database connection test failed');
			}

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

			console.log('SQL tables initialized successfully');
			return;
		} catch (error) {
			lastError = error as Error;
			retryCount++;

			console.error(`Error initiating SQL tables (attempt ${retryCount}/${maxRetries}):`, error);

			if (retryCount < maxRetries) {
				const waitTime = Math.pow(2, retryCount) * 1000;
				console.log(`Retrying in ${waitTime / 1000} seconds...`);
				await new Promise((resolve) => setTimeout(resolve, waitTime));
			}
		}
	}

	console.error(
		'Failed to initialize SQL tables after',
		maxRetries,
		'attempts. Application will continue without database functionality.',
		lastError
	);
}

initiateSqlTables().catch((error) => {
	console.error('Unexpected error in initiateSqlTables:', error);
});
