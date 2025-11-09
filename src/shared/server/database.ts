import {
	DATABASE_HOST,
	DATABASE_PASSWORD,
	DATABASE_PORT,
	DATABASE_USERNAME
} from '$env/static/private';
import postgres from 'postgres';

export class DatabaseService {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	sql!: postgres.Sql<{}>;
	private static instance: DatabaseService | null = null;
	private static isConnected: boolean = false;

	private constructor() {}

	static init() {
		try {
			this.instance ??= new DatabaseService();
			this.instance.sql = postgres({
				database: 'postgres',
				hostname: DATABASE_HOST,
				port: Number(DATABASE_PORT),
				username: DATABASE_USERNAME,
				password: DATABASE_PASSWORD,
				// Add connection timeout and retry settings
				connect_timeout: 10, // 10 seconds timeout
				idle_timeout: 20,
				max_lifetime: 60 * 30, // 30 minutes
				max: 10, // maximum connections in pool
				onnotice: () => {}, // suppress notices
				// Retry connection with exponential backoff
				connection: {
					application_name: 'mmbs'
				}
			});
			this.isConnected = true;
			return this.instance;
		} catch (error) {
			console.error('Database connection error:', error);
			this.isConnected = false;
			throw error;
		}
	}

	static isReady(): boolean {
		return this.isConnected && this.instance !== null;
	}

	static async testConnection(): Promise<boolean> {
		if (!this.instance) return false;
		try {
			await this.instance.sql`SELECT 1`;
			this.isConnected = true;
			return true;
		} catch (error) {
			console.error('Database connection test failed:', error);
			this.isConnected = false;
			return false;
		}
	}
}
