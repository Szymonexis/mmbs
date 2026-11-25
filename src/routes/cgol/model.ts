export const MIN_INTERVAL_MS = 10;
export const MAX_INTERVAL_MS = 10_000;
export const DEFAULT_INTERVAL_MS = 200;
export const MAX_CATCHUP_TICKS = 5;
export const SIM_BUDGET_MS = 8;
export const TPS_WINDOW_MS = 1000;
export const STATS_REFRESH_MS = 500;

export const INTERVAL_INPUT_STEP_MS = 10;

export function clampInterval(intervalMs: number): number {
	return Math.min(Math.max(Math.round(intervalMs), MIN_INTERVAL_MS), MAX_INTERVAL_MS);
}

export const GRID_MIN_CELL_PX = 8;
export const GRID_COLOR = 'rgba(255, 255, 255, 0.08)';
export const CELL_COLOR = 'white';
