export const MIN_INTERVAL_MS = 10;
export const MAX_INTERVAL_MS = 10_000;
export const DEFAULT_INTERVAL_MS = 200;
export const MAX_CATCHUP_TICKS = 5;
export const SIM_BUDGET_MS = 8;
export const TPS_WINDOW_MS = 1000;
export const STATS_REFRESH_MS = 500;

export const SPEED_STEPS = 1000;

const INTERVAL_RANGE_LOG = Math.log(MAX_INTERVAL_MS / MIN_INTERVAL_MS);

export function intervalFromSpeed(speed: number): number {
	return Math.round(MAX_INTERVAL_MS * Math.exp((-speed / SPEED_STEPS) * INTERVAL_RANGE_LOG));
}

export function speedFromInterval(intervalMs: number): number {
	return Math.round((SPEED_STEPS * Math.log(MAX_INTERVAL_MS / intervalMs)) / INTERVAL_RANGE_LOG);
}

export const GRID_MIN_CELL_PX = 8;
export const GRID_COLOR = 'rgba(255, 255, 255, 0.08)';
export const CELL_COLOR = 'white';
