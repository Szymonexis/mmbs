<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { t } from '$i18n';
	import { GameState } from './game/game-state';
	import { GameView } from './game/game-view';
	import { attachGestures } from './game/gestures';
	import { PATTERNS, PATTERN_KEYS, patternCells, type PatternKey } from './consts/patterns';
	import {
		CELL_COLOR,
		DEFAULT_INTERVAL_MS,
		GRID_COLOR,
		GRID_MIN_CELL_PX,
		MAX_CATCHUP_TICKS,
		SPEED_STEPS,
		STATS_REFRESH_MS,
		TPS_WINDOW_MS,
		intervalFromSpeed,
		speedFromInterval
	} from './model';

	const CONTROL_CLASS =
		'cursor-pointer rounded-md bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white';

	let tickCount = 0;
	let accumulatedMs = 0;
	let cameFromApp = false;

	let fps = $state(0);
	let tps = $state(0);
	let ticks = $state(0);
	let running = $state(true);
	let speed = $state(speedFromInterval(DEFAULT_INTERVAL_MS));
	const intervalMs = $derived(intervalFromSpeed(speed));

	let canvas: HTMLCanvasElement;

	const gameState = new GameState([{ pattern: 'Diamond', offset: [-2, -2] }]);
	const gameView = new GameView();

	afterNavigate(({ from }) => {
		cameFromApp = from !== null;
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
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const resize = () => {
			const dpr = window.devicePixelRatio || 1;
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			gameView.resize([width, height]);
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
		const recentTickTimes: number[] = [];

		const frame = (now: number) => {
			raf = requestAnimationFrame(frame);

			const elapsed = Math.max(0, now - last);
			last = now;

			if (running) {
				accumulatedMs = Math.min(accumulatedMs + elapsed, intervalMs * MAX_CATCHUP_TICKS);

				while (accumulatedMs >= intervalMs) {
					gameState.nextIteration();
					tickCount++;
					recentTickTimes.push(now);
					accumulatedMs -= intervalMs;
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

<div class="fixed inset-0 z-1000 overflow-hidden bg-black select-none">
	<canvas bind:this={canvas} aria-label={$t.cgol.board} class="block h-full w-full touch-none"
	></canvas>

	<div
		class="pointer-events-none absolute top-2 left-2 font-mono text-xs text-white/70 tabular-nums"
	>
		{$t.cgol.stats({ fps, tps, ticks })}
	</div>

	<button
		type="button"
		class="{CONTROL_CLASS} absolute top-2 right-2 flex size-9 items-center justify-center"
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
		<div class="pointer-events-auto flex flex-wrap gap-1">
			{#each PATTERN_KEYS as key (key)}
				<button
					type="button"
					class="{CONTROL_CLASS} px-2 py-1 text-xs"
					onclick={() => loadPattern(key)}
				>
					{$t.cgol.patterns[key]}
				</button>
			{/each}
			<button
				type="button"
				class="{CONTROL_CLASS} px-2 py-1 text-xs text-red-300"
				onclick={clearWorld}
			>
				{$t.cgol.clear}
			</button>
		</div>

		<div class="pointer-events-auto flex items-center gap-3">
			<button
				type="button"
				class="{CONTROL_CLASS} flex size-9 items-center justify-center"
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

			<label
				class="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs text-white/80 backdrop-blur-sm"
			>
				<span>{$t.cgol.speed}</span>
				<input
					type="range"
					min="0"
					max={SPEED_STEPS}
					bind:value={speed}
					class="w-28 cursor-pointer accent-white sm:w-44"
				/>
				<span class="w-16 text-right font-mono tabular-nums">
					{$t.cgol.interval({ ms: intervalMs })}
				</span>
			</label>
		</div>
	</div>
</div>
