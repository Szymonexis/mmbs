import { LogType, type LogRequest } from '$api/log/model';
import { page } from '$app/state';
import { browser } from '$app/environment';
import { resolve } from '$app/paths';

export async function onMountLog() {
	if (!browser) return;

	const body: LogRequest = {
		route: page.url.toString(),
		type: LogType.MOUNT,
		userAgent: navigator.userAgent
	};

	await fetch(resolve('/api/log'), {
		method: 'POST',
		body: JSON.stringify(body)
	});
}

export async function onDestroyLog() {
	if (!browser) return;

	const body: LogRequest = {
		route: page.url.toString(),
		type: LogType.DESTROY,
		userAgent: navigator.userAgent
	};

	await fetch(resolve('/api/log'), {
		method: 'POST',
		body: JSON.stringify(body)
	});
}
