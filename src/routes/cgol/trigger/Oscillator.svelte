<script lang="ts">
	import { onMount } from 'svelte';
	import { GameState } from '../game/game-state';
	import { OSCILLATORS, type OscillatorKey } from '../consts/oscillators';
	import { patternCells } from '../consts/patterns';
	import { CELL_COLOR, GRID_COLOR } from '../model';
	import { OSCILLATOR_MARGIN_CELLS, OSCILLATOR_TICK_MS, oscillatorBounds } from './model';

	let { pattern }: { pattern: OscillatorKey } = $props();

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const cells = patternCells(OSCILLATORS[pattern]);
		const [[min_x, min_y], [max_x, max_y]] = oscillatorBounds(cells);
		const patternColumns = max_x - min_x + 1;
		const patternRows = max_y - min_y + 1;

		const state = new GameState();
		state.load(cells);

		let width = 0;
		let height = 0;

		const draw = () => {
			const cellPx = Math.max(
				1,
				Math.floor(
					Math.min(
						width / (patternColumns + 2 * OSCILLATOR_MARGIN_CELLS),
						height / (patternRows + 2 * OSCILLATOR_MARGIN_CELLS)
					)
				)
			);
			const left = Math.round((width - cellPx * patternColumns) / 2);
			const top = Math.round((height - cellPx * patternRows) / 2);

			ctx.clearRect(0, 0, width, height);

			ctx.beginPath();
			for (let line_x = left % cellPx; line_x <= width; line_x += cellPx) {
				ctx.moveTo(line_x + 0.5, 0);
				ctx.lineTo(line_x + 0.5, height);
			}
			for (let line_y = top % cellPx; line_y <= height; line_y += cellPx) {
				ctx.moveTo(0, line_y + 0.5);
				ctx.lineTo(width, line_y + 0.5);
			}
			ctx.strokeStyle = GRID_COLOR;
			ctx.lineWidth = 1;
			ctx.stroke();

			ctx.fillStyle = CELL_COLOR;
			for (const {
				pos: [x, y]
			} of state.world) {
				ctx.fillRect(left + (x - min_x) * cellPx, top + (y - min_y) * cellPx, cellPx, cellPx);
			}
		};

		const resize = () => {
			const dpr = window.devicePixelRatio || 1;
			width = canvas.clientWidth;
			height = canvas.clientHeight;
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			draw();
		};

		resize();

		const ro = new ResizeObserver(resize);
		ro.observe(canvas);

		const interval = setInterval(() => {
			state.nextIteration();
			draw();
		}, OSCILLATOR_TICK_MS);

		return () => {
			clearInterval(interval);
			ro.disconnect();
		};
	});
</script>

<canvas bind:this={canvas} class="block h-full w-full"></canvas>
