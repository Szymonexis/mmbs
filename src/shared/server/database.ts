import {
	DATABASE_HOST,
	DATABASE_PASSWORD,
	DATABASE_PORT,
	DATABASE_USERNAME
} from '$env/static/private';
import postgres from 'postgres';

export const sql = postgres({
	database: 'postgres',
	hostname: DATABASE_HOST,
	port: Number(DATABASE_PORT),
	username: DATABASE_USERNAME,
	password: DATABASE_PASSWORD
});
