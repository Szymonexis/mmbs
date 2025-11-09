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

	private constructor() {}

	static init() {
		try {
			this.instance ??= new DatabaseService();
			this.instance.sql = postgres({
				database: 'postgres',
				hostname: DATABASE_HOST,
				port: Number(DATABASE_PORT),
				username: DATABASE_USERNAME,
				password: DATABASE_PASSWORD
			});
			return this.instance;
		} catch (error) {
			console.error('Database connection error:', error);
			throw error;
		}
	}
}
