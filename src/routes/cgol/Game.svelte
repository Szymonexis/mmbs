<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { t } from '$i18n';
	import { GameState } from './game/game-state';
	import { GameView } from './game/game-view';
	import { attachGestures } from './game/gestures';
	import {
		PATTERNS,
		PATTERN_KEYS,
		patternCells,
		randomPatternKey,
		type PatternKey
	} from './consts/patterns';
	import {
		CELL_COLOR,
		DEFAULT_INTERVAL_MS,
		GRID_COLOR,
		GRID_MIN_CELL_PX,
		INTERVAL_INPUT_STEP_MS,
		MAX_CATCHUP_TICKS,
		MAX_INTERVAL_MS,
		MIN_INTERVAL_MS,
		SIM_BUDGET_MS,
		STATS_REFRESH_MS,
		TPS_WINDOW_MS,
		clampInterval
	} from './model';

	const CONTROL_CLASS =
		'cursor-pointer rounded-md bg-white/10 backdrop-blur-sm hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white';
	const PATTERNS_PANEL_ID = 'cgol-patterns';

	let tickCount = 0;
	let accumulatedMs = 0;
	let cameFromApp = false;

	let fps = $state(0);
	let tps = $state(0);
	let ticks = $state(0);
	let running = $state(true);
	let intervalMs = $state(DEFAULT_INTERVAL_MS);
	let patternsOpen = $state(true);

	let canvas: HTMLCanvasElement;

	const gameState = new GameState();
	const gameView = new GameView();

	afterNavigate(({ from, type, delta }) => {
		cameFromApp =
			type !== 'enter' && from?.url != null && (type !== 'popstate' || (delta ?? 0) > 0);
	});

	function exit() {
		if (cameFromApp) {
			history.back();
		} else {
			goto(resolve('/'));
		}
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			exit();
		}
	}

	function commitInterval(event: Event & { currentTarget: HTMLInputElement }) {
		const input = event.currentTarget;
		if (Number.isFinite(input.valueAsNumber)) {
			intervalMs = clampInterval(input.valueAsNumber);
		}
		input.value = String(intervalMs);
	}

	function blurOnEnter(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
		if (event.key === 'Enter') {
			event.currentTarget.blur();
		}
	}

	function resetTicks() {
		tickCount = 0;
		ticks = 0;
		accumulatedMs = 0;
	}

	function loadPattern(key: PatternKey) {
		gameState.load(patternCells(PATTERNS[key]));
		gameView.centerOn([0, 0]);
		resetTicks();
	}

	function clearWorld() {
		gameState.clear();
		resetTicks();
	}

	function drawGrid(ctx: CanvasRenderingContext2D) {
		const [width, height] = gameView.config.span;
		const [[min_x, min_y], [max_x, max_y]] = gameView.visibleCellRange();

		ctx.beginPath();
		for (let x = min_x; x <= max_x + 1; x++) {
			const line_x = Math.round(gameView.worldToScreen([x, 0])[0]) + 0.5;
			ctx.moveTo(line_x, 0);
			ctx.lineTo(line_x, height);
		}
		for (let y = min_y; y <= max_y + 1; y++) {
			const line_y = Math.round(gameView.worldToScreen([0, y])[1]) + 0.5;
			ctx.moveTo(0, line_y);
			ctx.lineTo(width, line_y);
		}
		ctx.strokeStyle = GRID_COLOR;
		ctx.lineWidth = 1;
		ctx.stroke();
	}

	function drawCells(ctx: CanvasRenderingContext2D) {
		const [[min_x, min_y], [max_x, max_y]] = gameView.visibleCellRange();

		ctx.fillStyle = CELL_COLOR;
		for (const cell of gameState.world) {
			const [x, y] = cell.pos;
			if (x < min_x || x > max_x || y < min_y || y > max_y) continue;

			const [left, top] = gameView.worldToScreen([x, y]).map(Math.round);
			const [right, bottom] = gameView.worldToScreen([x + 1, y + 1]).map(Math.round);
			ctx.fillRect(left, top, Math.max(1, right - left), Math.max(1, bottom - top));
		}
	}

	function render(ctx: CanvasRenderingContext2D) {
		const [width, height] = gameView.config.span;
		ctx.clearRect(0, 0, width, height);

		if (gameView.cellPx >= GRID_MIN_CELL_PX) {
			drawGrid(ctx);
		}
		drawCells(ctx);
	}

	onMount(() => {
		loadPattern(randomPatternKey());

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let appliedDpr = 0;

		const resize = () => {
			appliedDpr = window.devicePixelRatio || 1;
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			canvas.width = Math.round(width * appliedDpr);
			canvas.height = Math.round(height * appliedDpr);
			ctx.setTransform(appliedDpr, 0, 0, appliedDpr, 0, 0);
			gameView.resize([width, height]);
			render(ctx);
		};

		resize();

		const ro = new ResizeObserver(resize);
		ro.observe(canvas);

		const detachGestures = attachGestures(canvas, {
			draw: (from, to) => gameState.addLine(gameView.screenToCell(from), gameView.screenToCell(to)),
			pan: (delta) => gameView.pan(delta),
			zoom: (factor, focus) => gameView.zoomAt(factor, focus)
		});

		const previousBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		let raf = 0;
		let last = performance.now();
		let frames = 0;
		let statsTimer = last;
		let appliedIntervalMs = intervalMs;
		const recentTickTimes: number[] = [];

		const frame = (now: number) => {
			raf = requestAnimationFrame(frame);

			if ((window.devicePixelRatio || 1) !== appliedDpr) {
				resize();
			}

			const elapsed = Math.max(0, now - last);
			last = now;

			if (running) {
				if (intervalMs !== appliedIntervalMs) {
					accumulatedMs = Math.min(accumulatedMs, intervalMs);
					appliedIntervalMs = intervalMs;
				}
				accumulatedMs = Math.min(accumulatedMs + elapsed, intervalMs * MAX_CATCHUP_TICKS);

				const simDeadline = performance.now() + SIM_BUDGET_MS;
				while (accumulatedMs >= intervalMs) {
					gameState.nextIteration();
					tickCount++;
					recentTickTimes.push(now);
					accumulatedMs -= intervalMs;

					if (performance.now() >= simDeadline) {
						accumulatedMs = Math.min(accumulatedMs, intervalMs);
						break;
					}
				}
			}

			while (recentTickTimes.length > 0 && recentTickTimes[0] <= now - TPS_WINDOW_MS) {
				recentTickTimes.shift();
			}

			render(ctx);

			frames++;
			if (now - statsTimer >= STATS_REFRESH_MS) {
				fps = Math.round((frames * 1000) / (now - statsTimer));
				tps = Math.round((recentTickTimes.length * 1000) / TPS_WINDOW_MS);
				ticks = tickCount;
				frames = 0;
				statsTimer = now;
			}
		};

		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			detachGestures();
			document.body.style.overflow = previousBodyOverflow;
		};
	});
</script>

<svelte:window onkeydown={onKeyDown} />

<div
	class="fixed inset-0 z-1000 touch-none overflow-hidden bg-black text-white scheme-dark select-none"
>
	<canvas bind:this={canvas} aria-label={$t.cgol.board} class="block h-full w-full touch-none"
	></canvas>

	<div
		class="pointer-events-none absolute top-2 left-2 font-mono text-xs text-white/70 tabular-nums"
	>
		{$t.cgol.stats({ fps, tps, ticks })}
	</div>

	<button
		type="button"
		class="{CONTROL_CLASS} absolute top-2 right-2 flex size-11 items-center justify-center sm:pointer-fine:size-9"
		aria-label={$t.cgol.exit}
		title={$t.cgol.exit}
		onclick={exit}
	>
		<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
			<path
				d="M6 6l12 12M18 6L6 18"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
			/>
		</svg>
	</button>

	<div class="pointer-events-none absolute inset-x-2 bottom-2 flex flex-col items-start gap-2">
		<div
			id={PATTERNS_PANEL_ID}
			class={[
				'pointer-events-auto flex-col gap-1 sm:flex-row sm:flex-wrap sm:pointer-fine:flex',
				patternsOpen ? 'flex' : 'hidden'
			]}
		>
			{#each PATTERN_KEYS as key (key)}
				<button
					type="button"
					class="{CONTROL_CLASS} px-3 py-2 text-sm sm:pointer-fine:px-2 sm:pointer-fine:py-1 sm:pointer-fine:text-xs"
					onclick={() => loadPattern(key)}
				>
					{$t.cgol.patterns[key]}
				</button>
			{/each}
			<button
				type="button"
				class="{CONTROL_CLASS} px-3 py-2 text-sm text-red-300 sm:pointer-fine:px-2 sm:pointer-fine:py-1 sm:pointer-fine:text-xs"
				onclick={clearWorld}
			>
				{$t.cgol.clear}
			</button>
		</div>

		<div class="pointer-events-auto flex w-full items-center gap-3 sm:w-auto">
			<button
				type="button"
				class="{CONTROL_CLASS} flex size-11 shrink-0 items-center justify-center sm:pointer-fine:size-9"
				aria-label={running ? $t.cgol.pause : $t.cgol.play}
				title={running ? $t.cgol.pause : $t.cgol.play}
				onclick={() => (running = !running)}
			>
				<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
					{#if running}
						<path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
					{:else}
						<path d="M8 5v14l11-7z" fill="currentColor" />
					{/if}
				</svg>
			</button>

			<button
				type="button"
				class="{CONTROL_CLASS} flex size-11 shrink-0 items-center justify-center sm:pointer-fine:hidden"
				aria-label={patternsOpen ? $t.cgol.hidePatterns : $t.cgol.showPatterns}
				title={patternsOpen ? $t.cgol.hidePatterns : $t.cgol.showPatterns}
				aria-expanded={patternsOpen}
				aria-controls={PATTERNS_PANEL_ID}
				onclick={() => (patternsOpen = !patternsOpen)}
			>
				<svg
					viewBox="0 0 24 24"
					class={['size-4 transition-transform', !patternsOpen && 'rotate-180']}
					aria-hidden="true"
				>
					<path
						d="M6 9l6 6 6-6"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>

			<label
				class="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-md bg-white/10 px-3 text-xs text-white/80 backdrop-blur-sm sm:flex-none sm:pointer-fine:h-9"
			>
				<span>{$t.cgol.interval}</span>
				<input
					type="number"
					inputmode="numeric"
					min={MIN_INTERVAL_MS}
					max={MAX_INTERVAL_MS}
					step={INTERVAL_INPUT_STEP_MS}
					value={intervalMs}
					onchange={commitInterval}
					onkeydown={blurOnEnter}
					class="h-8 w-20 min-w-0 rounded border-0 bg-black/40 px-2 py-0 text-right font-mono text-base text-white tabular-nums select-text focus:ring-2 focus:ring-white/60 sm:pointer-fine:h-7 sm:pointer-fine:text-xs"
				/>
				<span>{$t.cgol.intervalUnit}</span>
			</label>
		</div>
	</div>
</div>
