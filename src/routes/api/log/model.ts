import { IsDefined, IsEnum, IsString } from 'class-validator';

export enum LogType {
	MOUNT = 'MOUNT',
	DESTROY = 'DESTROY',
	UNLOAD = 'UNLOAD'
}

export class LogRequest {
	@IsString()
	@IsDefined()
	route: string;

	@IsString()
	@IsDefined()
	userAgent: string;

	@IsEnum(LogType)
	@IsDefined()
	type: LogType;
}
