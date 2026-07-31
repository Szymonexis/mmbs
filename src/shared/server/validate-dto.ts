import { type ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { error } from '@sveltejs/kit';
import { HttpStatus } from '$shared/http-status';

/**
 * Validates the (untrusted) argument of a remote function against a class-validator DTO.
 * Throws a 400 HttpError on failure, which remote functions propagate to the client.
 */
export async function validateDto<T extends object>(
	data: object,
	cls: ClassConstructor<T>
): Promise<T> {
	const dto = plainToInstance(cls, data);
	const errors = await validate(dto);

	if (errors.length > 0) {
		const details = errors
			.map((err) => `${err.property}: ${Object.values(err.constraints ?? {}).join(', ')}`)
			.join('; ');

		error(HttpStatus.BAD_REQUEST, details);
	}

	return dto;
}
